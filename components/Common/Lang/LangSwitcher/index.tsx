// Libs
import React from 'react';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";
// Redux
import { Lang } from "@/app-redux/lang/model";
import { langActions } from "@/app-redux/lang/actions";
import { AppState } from '@/app-redux/state';
// MUI Components
import { Button, ButtonGroup, Grow, MenuItem, MenuList, Paper, Popper, ClickAwayListener} from '@mui/material';
import { ArrowDropDown } from "@mui/icons-material";
// Constants
import { LOCALES } from "@/utils/i18n";
// Styles
import styles from './styles.module.scss';

type Props = {
  langBtnText?: string;
}

/**
 * Lang Switcher Component
 * @param props
 * @constructor
 */
const LangSwitcher: React.FC<Props> = (props) => {

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [openLangBtn, setOpenLangBtn] = React.useState(false);
  const { selected_lang } : any = useSelector((state: AppState) => state.lang);
  const {push, reload, asPath} : any = useRouter();
  const { i18n } = useTranslation()

  const handleToggleLangBtn = () => {
    setOpenLangBtn((prevOpen) => !prevOpen);
  };

  const handleCloseLangBtn = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenLangBtn(false);
  };

  const handleChangeLangClick = async (
    locale: Lang,
  ) => {
    setOpenLangBtn(false);
    if(selected_lang!=locale.code){
      await i18n.changeLanguage(locale.code)
      langActions.onChangeLang(locale);
      await push(asPath, undefined, { locale: locale.code,  shallow: true  });
      //reload();
    }
  };

  return (
    <>
      {!!selected_lang && (
        <ButtonGroup  ref={anchorRef} aria-label="split button">
          <Button
            className={styles.langBtn}
            aria-controls={openLangBtn ? 'split-button-menu' : undefined}
            aria-expanded={openLangBtn ? 'true' : undefined}
            aria-haspopup="menu"
            onClick={handleToggleLangBtn}
            endIcon={<ArrowDropDown width={'18px'} height={'18px'} />}
          >
            {props.langBtnText ? props.langBtnText: ''}
            {LOCALES.find((e)=>e.code == selected_lang.code)?.name}
          </Button>
        </ButtonGroup>
      )}

      <Popper className={styles.zIndex} open={openLangBtn} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={(e)=>handleCloseLangBtn(e)}>
                <MenuList id="split-button-menu">
                  {LOCALES?.map((option, index) => (
                    <MenuItem
                      key={option.code}
                      onClick={(event) => handleChangeLangClick(option)}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};


export default LangSwitcher;
