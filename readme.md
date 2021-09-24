# `react-text-translator`

A typed way to translate react apps with context

Firstly, define your translator as follows

```tsx
import {createTranslations} from 'react-text-translator';

export const translator = createTranslations({
	'Hello World': {
		SPANISH: 'Hola mundo',
		BRITISH: 'Hello World',
	},
	'Contact Us': {
		BRITISH: 'Contact Us',
		SPANISH: 'Contáctanos',
	},
});

export const Text = translator.Text;
```

Second, initialize your context and provide state for the active language

```tsx
import {translator} from './translator';

function LangWrapper() {
	const [lang, setLang] = useState('BRITISH');

	return (
		<translator.TranslationProvider activeLang={lang}>
			<App />
		</translator.TranslationProvider>
	);
}
```

Then, you are able to use the `<Text />` component as you would any other by passing a string as it's children (and only a string).

````tsx
import {Text} from './translator';

export default function Child() {
  return (
    <div>
      <Text>Hello World</Text>
      <Text>Contact Us</Text>
    </div>
  );
}```
````
