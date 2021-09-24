# react-text-translator

A typed way to translate react apps with context

Firstly, define your translator as follows

```tsx
import {createTranslations} from './context';

type Languages = 'BRITISH' | 'SPANISH';
type Phrases = 'Hello World' | 'Contact Us';

export const translator = createTranslations<Languages, Phrases>('BRITISH', {
	'Hello World': {
		SPANISH: 'Hola Globa',
		BRITISH: 'Hello World',
	},
	'Contact Us': {
		BRITISH: 'Contact Us',
		SPANISH: 'Contacterino',
	},
});

export const Text = translator.Text;
```

Then, you are able to use the `<Text />` component as you would any other by passing a string as it's children (and only a string).
