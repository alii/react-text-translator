import React, {createContext, ReactNode, useContext, useMemo} from 'react';

export interface TranslationContext<Languages extends string, Keys extends string> {
	translations: Record<Keys, Record<Languages, string>>;
}

const getContext = <Languages extends string, Keys extends string>(
	data: TranslationContext<Languages, Keys>
) => createContext<TranslationContext<Languages, Keys>>(data);

export function createTranslations<Languages extends string, Keys extends string>(
	data: Record<Keys, Record<Languages, string>>
) {
	const context = getContext({translations: data});

	function useTextTranslateContext() {
		const contextData = useContext(context);

		if (!contextData) {
			throw new Error('No <TranslationProvider /> found for useTextTranslateContext()');
		}

		return contextData;
	}

	function TranslationProvider(props: {children: ReactNode}) {
		const memo = useMemo(() => ({translations: data}), [data]);
		return <context.Provider value={memo}>{props.children}</context.Provider>;
	}

	function Text(props: {children: keyof typeof data}) {
		const {translations} = useTextTranslateContext();
		return <>{translations[props.children]}</>;
	}

	return {useTextTranslateContext, TranslationProvider, Text};
}
