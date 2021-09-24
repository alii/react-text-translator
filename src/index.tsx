import React, {createContext, ReactNode, useContext, useMemo} from 'react';

/**
 * The context shared around the app
 */
export interface TranslationContext<Languages extends string, Keys extends string> {
	/**
	 * An object of phrases and their respective language translations
	 */
	translations: Record<Keys, Record<Languages, string>>;

	/**
	 * The active language to be displayed in the app
	 */
	activeLang: Languages;
}

/**
 * @internal
 * @returns Context typed with languages and keys
 */
const getContext = <Languages extends string, Keys extends string>() =>
	createContext<TranslationContext<Languages, Keys> | null>(null);

/**
 * Generates context and components that are all typed
 * @param data The dictionary of languages to render
 * @returns Helper functions and components to use in your app
 */
export function createTranslations<Languages extends string, Keys extends string>(
	data: Record<Keys, Record<Languages, string>>
) {
	const context = getContext<Languages, Keys>();
	const phrases = Object.keys(data) as Keys[];
	const languages = [
		...new Set(
			phrases.map(phrase => {
				const translations = data[phrase];
				return Object.keys(translations) as Array<keyof typeof translations>;
			})
		),
	];

	function useTextTranslateContext() {
		const contextData = useContext(context);

		if (!contextData) {
			throw new Error('No <TranslationProvider /> found for useTextTranslateContext()');
		}

		return contextData;
	}

	/**
	 * Gets a list of phrases
	 * @returns An array of available phrases
	 */
	function getPhrases() {
		return phrases;
	}

	/**
	 * Gets a list of languages
	 * @returns An array of given languages
	 */
	function getLanguages() {
		return languages;
	}

	/**
	 * Checks if a given phrase is a valid dictionary key
	 * @param text A string
	 * @returns A boolean if this text is a valid phrase
	 */
	function isValidPhrase(text: string): text is Keys {
		return text in data;
	}

	/**
	 * The context provider that provides the dictionary and a given language to <Text />s
	 * @param props Pass children and an activeLang to the TranslationProvider
	 * @returns The context provider
	 */
	function TranslationProvider(props: {children: ReactNode; activeLang: Languages}) {
		const memo = useMemo(
			() => ({translations: data, activeLang: props.activeLang}),
			[props.activeLang]
		);

		return <context.Provider value={memo}>{props.children}</context.Provider>;
	}

	/**
	 * Renders text changing the text for
	 * @param props The props for this element. You should only pass text value as the children for <Text />
	 * @returns A react component
	 * @example
	 * <Text>Hello World</Text>
	 * <Text phrase="Hello World" />
	 *
	 * // Override language
	 * <Text lang="en-gb" phrase="Hello World" />
	 * <Text lang="en-gb">Hello World</Text>
	 */
	function Text(props: ({children: string} | {phrase: Keys}) & {lang?: Languages}) {
		const {translations, activeLang} = useTextTranslateContext();

		const phrase = 'children' in props ? props.children : props.phrase;

		const isValid = isValidPhrase(phrase);

		if (!isValid) {
			throw new Error(
				'Invalid phrase passed to <Text />. Must be a valid key given to the translator!'
			);
		}

		const language = translations[phrase];

		return <>{language[props.lang ?? activeLang]}</>;
	}

	return {
		getPhrases,
		getLanguages,
		useTextTranslateContext,
		TranslationProvider,
		Text,
		isValidPhrase,
	};
}
