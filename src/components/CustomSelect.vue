<script setup>
import { ref, onMounted } from 'vue'

import { SelectActions, getActionFromKey, getIndexByLetter, getUpdatedIndex, isElementInView, isScrollable, maintainScrollVisibility } from '../util/combo';

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  selectedIndex: {
    type: Number,
    required: false,
    default: 0,
  },
  label: {
    type: String,
    required: true,
    default: '',
  },
});

// let selected = props.default
//         ? props.default
//         : props.options.length > 0
//         ? props.options[0]
//         : null;
// let open = false;

// onMounted(()=> {
//   this.$emit("input", this.selected);
// });
const emit = defineEmits(['update:selected']);

let select = ref(null);
let combo = ref(null);
let list = ref(null);

// state
let activeIndex = 0;
let open = ref(false);
let searchString = '';
let searchTimeout = null;
let ignoreBlur = null;
let comboId = 'combo' + crypto.randomUUID();

onMounted(() => {
  combo.value.innerHTML = props.options[props.selectedIndex];
});

let onBlur = () => {
  if (ignoreBlur) {
    ignoreBlur = false;
    return;
  }

  if (open.value) {
    selectOption(activeIndex);
    updateMenuState(false, false);
  }
}

let handleClick = () => {
  updateMenuState(!open.value, false);
}

let handleKeyEvent = (e) => {
  const { key } = e;
  const max = props.options.length - 1;

  const action = getActionFromKey(e, open.value);

  switch (action) {
    case SelectActions.Last:
    case SelectActions.First:
      updateMenuState(true);
    // intentional fallthrough
    case SelectActions.Next:
    case SelectActions.Previous:
    case SelectActions.PageUp:
    case SelectActions.PageDown:
      e.preventDefault();
      return onOptionChange(
        getUpdatedIndex(activeIndex, max, action)
      );
    case SelectActions.CloseSelect:
      e.preventDefault();
      selectOption(activeIndex);
    // intentional fallthrough
    case SelectActions.Close:
      e.preventDefault();
      return updateMenuState(false);
    case SelectActions.Type:
      return onComboType(key);
    case SelectActions.Open:
      e.preventDefault();
      return updateMenuState(true);
  }
}

function handleOptionClick(index, e) {
  e.stopPropagation();
  onOptionClick(index);
}

function handleOptionMouseDown() {
  ignoreBlur = true;
}

function onOptionClick (index) {
  onOptionChange(index);
  selectOption(index);
  updateMenuState(false);
}

function onOptionChange (index) {
  // update state
  activeIndex = index;

  // update aria-activedescendant
  combo.value.setAttribute('aria-activedescendant', `${comboId}-${index}`);

  // update active option styles
  const options = select.value.querySelectorAll('[role=option]');
  [...options].forEach((optionEl) => {
    optionEl.classList.remove('option-current');
  });
  options[index].classList.add('option-current');

  // ensure the new option is in view
  if (isScrollable(list.value)) {
    maintainScrollVisibility(options[index], list.value);
  }

  // ensure the new option is visible on screen
  // ensure the new option is in view
  if (!isElementInView(options[index])) {
    options[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function onComboType (letter) {
  // open the listbox if it is closed
  updateMenuState(true);

  // find the index of the first matching option
  const cSearchString = getSearchString(letter);
  const searchIndex = getIndexByLetter(
    props.options,
    cSearchString,
    activeIndex + 1
  );

  // if a match was found, go to it
  if (searchIndex >= 0) {
    onOptionChange(searchIndex);
  }
  // if no matches, clear the timeout and search string
  else {
    window.clearTimeout(searchTimeout);
    searchString = '';
  }
}

function selectOption(index) {
  // update state
  activeIndex = index;

  // update displayed value
  const selected = props.options[index];
  combo.value.innerHTML = selected;

  // update aria-selected
  const options = select.value.querySelectorAll('[role=option]');
  [...options].forEach((optionEl) => {
    optionEl.setAttribute('aria-selected', 'false');
  });
  options[index].setAttribute('aria-selected', 'true');
  emit('update:selected', index);
}

function updateMenuState(openState, callFocus = true) {
  if (open.value === openState) {
    return;
  }

  // update state
  open.value = openState;

  // update aria-expanded and styles
  combo.value.setAttribute('aria-expanded', `${open.value}`);
  open.value ? select.value.classList.add('open') : select.value.classList.remove('open');

  // update activedescendant
  const activeID = open.value ? `${comboId}-${activeIndex}` : '';
  combo.value.setAttribute('aria-activedescendant', activeID);

  if (activeID === '' && !isElementInView(combo.value)) {
    combo.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // move focus back to the combobox, if needed
  callFocus && combo.value.focus();
}

function getSearchString (char) {
  // reset typing timeout and start new timeout
  // this allows us to make multiple-letter matches, like a native select
  if (typeof searchTimeout === 'number') {
    window.clearTimeout(searchTimeout);
  }

  searchTimeout = window.setTimeout(() => {
    searchString = '';
  }, 500);

  // add most recent letter to saved search string
  searchString += char;
  return searchString;
}

</script>
<template>
  <label :id="comboId + '-label'" class="combo-label">{{ props.label }}</label>
  <div class="combo js-select" ref="select">
    <div
      class="combo-input"
      :id="comboId"
      role="combobox"
      tabindex="0"
      :aria-controls="comboId+'-list'"
      aria-expanded="false"
      aria-haspopup="listbox"
      :aria-labelledby="comboId + '-label'"
      ref="combo"

      @blur.capture.stop="onBlur"
      @click.stop="handleClick"
      @keydown.stop="handleKeyEvent">
    </div>
    <transition name="slide-down">
      <div
        v-if="open"
        class="combo-menu"
        :id="comboId+'-list'"
        role="listbox"
        tabindex="-1"
        :aria-labelledby="comboId + '-label'"
        ref="list">
        <div
          v-for="(option, i) of props.options"
          :key="i"
          :id="comboId+'-'+i"
          role="option"
          :class="i === props.selectedIndex ? 'combo-option option-current' : 'combo-option'"
          :aria-selected="i === props.selectedIndex ? 'true' : 'false'"
          @click.stop="(event) => handleOptionClick(i, event)"
          @mousedown="handleOptionMouseDown"
        >{{ option }}</div>
      </div>
    </transition>
  </div>
</template>

<style>
  .combo *,
  .combo *::before,
  .combo *::after {
    box-sizing: border-box;
  }

  .combo {
    display: block;
    margin-bottom: 1.5em;
    max-width: 400px;
    position: relative;
  }

  .combo::after {
    border-right-width: 2px;
    border-bottom-width: 2px;
    border-right-style: solid;
    border-bottom-style: solid;
    content: "";
    display: block;
    height: 12px;
    pointer-events: none;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translate(0, -65%) rotate(45deg);
    width: 12px;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .combo.open::after {
    transform: translate(0, -65%) rotate(225deg);
  }

  .combo-input {
    border-width: 2px;
    border-style: solid;
    border-radius: 4px;
    display: block;
    font-size: 1em;
    min-height: calc(1.4em + 26px);
    padding: 12px 16px 14px;
    text-align: left;
    width: 100%;
  }

  .open .combo-input {
    border-radius: 4px 4px 0 0;
  }

  .combo-input:focus {
    border-color: #0067b8;
    box-shadow: 0 0 4px 2px #0067b8;
    outline: 4px solid transparent;
  }

  .combo-label {
    display: block;
    margin-bottom: 0.25em;
  }

  .combo-menu {
    background-color: rgb(var(--v-theme-on-surface-variant));
    border-width: 1px;
    border-style: solid;

    border-radius: 0 0 4px 4px;
    overflow-y: scroll;
    left: 0;
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 100;
  }

  @keyframes slideInDown {
    from {
      visibility: visible;
      max-height: 0px;
    }

    to {
      max-height: 300px;
    }
  }
  @keyframes slideInUp {
    from {
      visibility: visible;
      max-height: 300px;
    }

    to {
      max-height: 0px;
    }
  }

  .slide-down-enter-active {
    animation-name: slideInDown;
    animation-duration: 0.15s;
    animation-timing-function: ease-in-out;
  }
  .slide-down-leave-active {
    animation-name: slideInUp;
    animation-duration: 0.25s;
    animation-timing-function: ease-in-out;
  }

  .combo-option {
    padding: 10px 12px 12px;
  }

  .combo-option:hover {
    background-color: rgb(0 0 0 / 10%);
  }

  .combo-option.option-current {
    outline-width: 3px;
    outline-style: solid;
    outline-offset: -3px;
  }

  .combo-option[aria-selected="true"] {
    padding-right: 30px;
    position: relative;
  }

  .combo-option[aria-selected="true"]::after {
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-right-width: 2px;
    border-right-style: solid;
    content: "";
    height: 16px;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translate(0, -50%) rotate(45deg);
    width: 8px;
  }
</style>
