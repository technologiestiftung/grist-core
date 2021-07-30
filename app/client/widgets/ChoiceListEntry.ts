import {basicButton, primaryButton} from 'app/client/ui2018/buttons';
import {colors, testId} from 'app/client/ui2018/cssVars';
import {Computed, Disposable, dom, DomContents, DomElementArg, Holder, Observable, styled} from 'grainjs';
import {icon} from 'app/client/ui2018/icons';
import isEqual = require('lodash/isEqual');
import uniqBy = require('lodash/uniqBy');
import {IToken, TokenField} from 'app/client/lib/TokenField';
import {ChoiceOptionsByName, IChoiceOptions} from 'app/client/widgets/ChoiceTextBox';
import {DEFAULT_TEXT_COLOR} from 'app/client/widgets/ChoiceToken';
import {colorButton} from 'app/client/ui2018/ColorSelect';
import {createCheckers, iface, ITypeSuite, opt} from 'ts-interface-checker';

class ChoiceItem implements IToken {
  constructor(
    public label: string,
    public options?: IChoiceOptions,
  ) {}
}

const ChoiceItemType = iface([], {
  label: "string",
  options: opt("ChoiceOptionsType"),
});

const ChoiceOptionsType = iface([], {
  textColor: "string",
  fillColor: "string",
});

const choiceTypes: ITypeSuite = {
  ChoiceItemType,
  ChoiceOptionsType,
};

const {ChoiceItemType: ChoiceItemChecker} = createCheckers(choiceTypes);

const UNSET_COLOR = '#ffffff';

/**
 * ChoiceListEntry - Editor for choices and choice colors.
 *
 * The ChoiceListEntry can be in one of two modes: edit or view (default).
 *
 * When in edit mode, it displays a custom, vertical TokenField that allows for entry
 * of new choice values. Once changes are saved, the new values become valid choices,
 * and can be used in Choice and Choice List columns. Each choice in the TokenField
 * also includes a color picker button to customize the fill/text color of the choice.
 * The same capabilities of TokenField, such as undo/redo and rich copy/paste support,
 * are present in ChoiceListEntry as well.
 *
 * When in view mode, it looks similar to edit mode, but hides the bottom input and the
 * color picker dropdown buttons. Past 6 choices, it stops rendering individual choices
 * and only shows the total number of additional choices that are hidden, and can be
 * seen when edit mode is activated.
 *
 * Usage:
 * > dom.create(ChoiceListEntry, values, options, (vals, options) => {});
 */
export class ChoiceListEntry extends Disposable {
  private _isEditing: Observable<boolean> = Observable.create(this, false);
  private _tokenFieldHolder: Holder<TokenField<ChoiceItem>> = Holder.create(this);

  constructor(
    private _values: Observable<string[]>,
    private _choiceOptionsByName: Observable<ChoiceOptionsByName>,
    private _onSave: (values: string[], choiceOptions: ChoiceOptionsByName) => void
  ) {
    super();

    // Since the saved values can be modified outside the ChoiceListEntry (via undo/redo),
    // add a listener to update edit status on changes.
    this.autoDispose(this._values.addListener(() => {
      this._cancel();
    }));
  }

  // Arg maxRows indicates the number of rows to display when the editor is inactive.
  public buildDom(maxRows: number = 6): DomContents {
    return dom.domComputed(this._isEditing, (editMode) => {
      if (editMode) {
        const tokenField = TokenField.ctor<ChoiceItem>().create(this._tokenFieldHolder, {
          initialValue: this._values.get().map(label => {
            return new ChoiceItem(label, this._choiceOptionsByName.get().get(label));
          }),
          renderToken: token => this._renderToken(token),
          createToken: label => new ChoiceItem(label),
          clipboardToTokens: clipboardToChoices,
          tokensToClipboard: (tokens, clipboard) => {
            // Save tokens as JSON for parts of the UI that support deserializing it properly (e.g. ChoiceListEntry).
            clipboard.setData('application/json', JSON.stringify(tokens));
            // Save token labels as newline-separated text, for general use (e.g. pasting into cells).
            clipboard.setData('text/plain', tokens.map(t => t.label).join('\n'));
          },
          openAutocompleteOnFocus: false,
          trimLabels: true,
          styles: {cssTokenField, cssToken, cssTokenInput, cssInputWrapper, cssDeleteButton, cssDeleteIcon},
          keyBindings: {
            previous: 'ArrowUp',
            next: 'ArrowDown'
          }
        });

        return cssVerticalFlex(
          cssListBox(
            elem => {
              tokenField.attach(elem);
              this._focusOnOpen(tokenField.getTextInput());
            },
            testId('choice-list-entry')
          ),
          cssButtonRow(
            primaryButton('Save',
              dom.on('click', () => this._save() ),
              testId('choice-list-entry-save')
            ),
            basicButton('Cancel',
              dom.on('click', () => this._cancel()),
              testId('choice-list-entry-cancel')
            )
          ),
          dom.onKeyDown({Escape$: () => this._cancel()}),
          dom.onKeyDown({Enter$: () => this._save()}),
        );
      } else {
        const someValues = Computed.create(null, this._values, (_use, values) =>
          values.length <= maxRows ? values : values.slice(0, maxRows - 1));

        return cssVerticalFlex(
          cssListBoxInactive(
            dom.autoDispose(someValues),
            dom.maybe(use => use(someValues).length === 0, () =>
              row('No choices configured')
            ),
            dom.domComputed(this._choiceOptionsByName, (choiceOptions) =>
              dom.forEach(someValues, val => {
                return row(
                  cssTokenColorInactive(
                    dom.style('background-color', getFillColor(choiceOptions.get(val))),
                    testId('choice-list-entry-color')
                  ),
                  cssTokenLabel(val)
                );
              }),
            ),
            // Show description row for any remaining rows
            dom.maybe(use => use(this._values).length > maxRows, () =>
              row(
                dom.text((use) => `+${use(this._values).length - (maxRows - 1)} more`)
              )
            ),
            dom.on('click', () => this._startEditing()),
            testId('choice-list-entry')
          ),
          cssButtonRow(
            primaryButton('Edit',
              dom.on('click', () => this._startEditing()),
              testId('choice-list-entry-edit')
            )
          )
        );
      }
    });
  }

  private _startEditing(): void {
    this._isEditing.set(true);
  }

  private _save(): void {
    const tokenField = this._tokenFieldHolder.get();
    if (!tokenField) { return; }

    const tokens = tokenField.tokensObs.get();
    const tokenInputVal = tokenField.getTextInputValue();
    if (tokenInputVal !== '') {
      tokens.push(new ChoiceItem(tokenInputVal));
    }

    const newTokens = uniqBy(tokens, t => t.label);
    const newValues = newTokens.map(t => t.label);
    const newOptions: ChoiceOptionsByName = new Map();
    for (const t of newTokens) {
      if (t.options) {
        newOptions.set(t.label, {
          fillColor: t.options.fillColor,
          textColor: t.options.textColor
        });
      }
    }

    // Call user save function if the values and/or options have changed.
    if (!isEqual(this._values.get(), newValues)
      || !isEqual(this._choiceOptionsByName.get(), newOptions)) {
      // Because of the listener on this._values, editing will stop if values are updated.
      this._onSave(newValues, newOptions);
    } else {
      this._cancel();
    }
  }

  private _cancel(): void {
    this._isEditing.set(false);
  }

  private _focusOnOpen(elem: HTMLInputElement): void {
    setTimeout(() => focus(elem), 0);
  }

  private _renderToken(token: ChoiceItem) {
    const fillColorObs = Observable.create(null, getFillColor(token.options));
    const textColorObs = Observable.create(null, getTextColor(token.options));

    return cssColorAndLabel(
      dom.autoDispose(fillColorObs),
      dom.autoDispose(textColorObs),
      colorButton(textColorObs,
        fillColorObs,
        async () => {
          const tokenField = this._tokenFieldHolder.get();
          if (!tokenField) { return; }

          const fillColor = fillColorObs.get();
          const textColor = textColorObs.get();
          tokenField.replaceToken(token.label, new ChoiceItem(token.label, {fillColor, textColor}));
        }
      ),
      cssTokenLabel(token.label)
    );
  }
}

// Helper to focus on the token input and select/scroll to the bottom
function focus(elem: HTMLInputElement) {
  elem.focus();
  elem.setSelectionRange(elem.value.length, elem.value.length);
  elem.scrollTo(0, elem.scrollHeight);
}

// Build a display row with the given DOM arguments
function row(...domArgs: DomElementArg[]): Element {
  return cssListRow(
    ...domArgs,
    testId('choice-list-entry-row')
  );
}

function getTextColor(choiceOptions?: IChoiceOptions) {
  return choiceOptions?.textColor ?? DEFAULT_TEXT_COLOR;
}

function getFillColor(choiceOptions?: IChoiceOptions) {
  return choiceOptions?.fillColor ?? UNSET_COLOR;
}

/**
 * Converts clipboard contents (if any) to choices.
 *
 * Attempts to convert from JSON first, if clipboard contains valid JSON.
 * If conversion is not possible, falls back to converting from newline-separated plaintext.
 */
function clipboardToChoices(clipboard: DataTransfer): ChoiceItem[] {
  const maybeTokens = clipboard.getData('application/json');
  if (maybeTokens && isJSON(maybeTokens)) {
    const tokens = JSON.parse(maybeTokens);
    if (Array.isArray(tokens) && tokens.every((t): t is ChoiceItem => ChoiceItemChecker.test(t))) {
      return tokens;
    }
  }

  const maybeText = clipboard.getData('text/plain');
  if (maybeText) {
    return maybeText.split('\n').map(label => new ChoiceItem(label));
  }

  return [];
}

function isJSON(string: string) {
  try {
    JSON.parse(string);
    return true;
  } catch {
    return false;
  }
}

const cssListBox = styled('div', `
  width: 100%;
  padding: 1px;
  line-height: 1.5;
  padding-left: 4px;
  padding-right: 4px;
  border: 1px solid ${colors.hover};
  border-radius: 4px;
  background-color: white;
`);

const cssListBoxInactive = styled(cssListBox, `
  cursor: pointer;
  border: 1px solid ${colors.darkGrey};

  &:hover {
    border: 1px solid ${colors.hover};
  }
`);

const cssListRow = styled('div', `
  display: flex;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 4px 8px;
  color: ${colors.dark};
  background-color: ${colors.mediumGrey};
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
`);

const cssTokenField = styled('div', `
  &.token-dragactive {
    cursor: grabbing;
  }
`);

const cssToken = styled(cssListRow, `
  position: relative;
  display: flex;
  justify-content: space-between;
  user-select: none;
  cursor: grab;

  &.selected {
    background-color: ${colors.darkGrey};
  }
  &.token-dragging {
    pointer-events: none;
    z-index: 1;
    opacity: 0.7;
  }
  .${cssTokenField.className}.token-dragactive & {
    cursor: unset;
  }
`);

const cssTokenColorInactive = styled('div', `
  flex-shrink: 0;
  width: 18px;
  height: 18px;
`);

const cssTokenLabel = styled('span', `
  margin-left: 6px;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: pre;
  overflow: hidden;
`);

const cssTokenInput = styled('input', `
  padding-top: 4px;
  padding-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: auto;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  outline: none;
`);

const cssInputWrapper = styled('div', `
  margin-top: 4px;
  margin-bottom: 4px;
  position: relative;
  flex: auto;
  display: flex;
`);

const cssFlex = styled('div', `
  display: flex;
`);

const cssColorAndLabel = styled(cssFlex, `
  max-width: calc(100% - 16px);
`);

const cssVerticalFlex = styled('div', `
  width: 100%;
  display: flex;
  flex-direction: column;
`);

const cssButtonRow = styled('div', `
  gap: 8px;
  display: flex;
  margin-top: 8px;
  margin-bottom: 16px;
`);

const cssDeleteButton = styled('div', `
  display: inline;
  float:right;
  cursor: pointer;
  .${cssTokenField.className}.token-dragactive & {
    cursor: unset;
  }
`);

 const cssDeleteIcon = styled(icon, `
   --icon-color: ${colors.slate};
   &:hover {
     --icon-color: ${colors.dark};
   }
 `);