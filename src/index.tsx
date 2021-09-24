import React, {createContext, ReactNode, useContext, useMemo} from 'react';

export interface TranslationContext<Languages extends string, Keys extends string> {
	translations: Record<Keys, Record<Languages, string>>;
	activeLang: Languages;
}

const getContext = <Languages extends string, Keys extends string>(
	data: TranslationContext<Languages, Keys>
) => createContext<TranslationContext<Languages, Keys>>(data);

export function createTranslations<Languages extends string, Keys extends string>(
	initialLang: Languages,
	data: Record<Keys, Record<Languages, string>>
) {
	const context = getContext({translations: data, activeLang: initialLang});

	function useTextTranslateContext() {
		const contextData = useContext(context);

		if (!contextData) {
			throw new Error('No <TranslationProvider /> found for useTextTranslateContext()');
		}

		return contextData;
	}

	function isValidPhrase(text: string): text is keyof typeof data {
		return text in data;
	}

	function TranslationProvider(props: {children: ReactNode}) {
		const memo = useMemo(() => ({translations: data, activeLang: initialLang}), []);
		return <context.Provider value={memo}>{props.children}</context.Provider>;
	}

	function Text({children: phrase}: {children: string}) {
		const {translations, activeLang} = useTextTranslateContext();

		const isValid = isValidPhrase(phrase);

		if (!isValid) {
			throw new Error(
				'Invalid phrase passed to <Text />. Must be a valid key given to the translator!'
			);
		}

		const language = translations[phrase];
		return <>{language[activeLang]}</>;
	}

	return {useTextTranslateContext, TranslationProvider, Text, isValidPhrase};
}
