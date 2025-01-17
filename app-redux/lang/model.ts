/**
 * @interface Lang
 */
export interface Lang {
  id?: number;
  name: string;
  code: string;
}

/**
 * @interface LangState
 */
export interface LangState {
  selected_lang: Lang | null
}