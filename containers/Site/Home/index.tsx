// Libs
import React, {useEffect} from 'react';
import {useTranslation} from "next-i18next";
// Constants
import {I18nPages} from "@/utils/i18n";
// Styles
import styles from './style.module.scss';

/**
 * Home Page Container
 * @constructor
 */
const Home = () => {
    const { t } = useTranslation(I18nPages.HOME);

    return (
        <>
            <div className={styles.home}>
                <h1>{t('title')}</h1>
            </div>
        </>
    );
};

export default Home;
