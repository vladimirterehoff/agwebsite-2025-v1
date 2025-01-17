export interface FormTab {
  value: string;
  name?: any;
  content?: any;
  errorNames?: string[];
  notStrictNameMatch?: boolean;
}

type Params = {
  setTab: (value: string) => void;
  error: any;
  tabs: FormTab[];
};

export const showTabWithErrors = ({ setTab, error, tabs }: Params) => {
  const checkedErrors: any = error?.errors?.length ? error?.errors : error;
  const errorNames: string[] = checkedErrors?.map((item: any) => item?.field);

  outerLoop: for (const tab of tabs) {
    if (tab.errorNames?.length) {
      for (const error of tab.errorNames) {
        if (
          tab.notStrictNameMatch
            ? errorNames.find((name) => name.includes(error))
            : errorNames.includes(error)
        ) {
          setTab(tab.value);
          break outerLoop;
        }
      }
    }
  }
};
