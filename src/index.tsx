import React, {createContext, ReactNode, useContext, useMemo} from 'react';

export interface TranslationContext<Languages extends string, Keys extends string> {
	translations: Record<Keys, Record<Languages, string>>;
	activeLang: Languages;
}

const getContext = <Languages extends string, Keys extends string>() =>
	createContext<TranslationContext<Languages, Keys> | null>(null);

export function createTranslations<Languages extends string, Keys extends string>(
	data: Record<Keys, Record<Languages, string>>
) {
	const context = getContext<Languages, Keys>();

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

	function TranslationProvider(props: {children: ReactNode; activeLang: Languages}) {
		const memo = useMemo(
			() => ({translations: data, activeLang: props.activeLang}),
			[props.activeLang]
		);

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
