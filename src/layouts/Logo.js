import React from 'react';
import { formatMessage } from 'umi/locale';
import light from '../assets/light.png';

import styles from './BasicLayout.less';

export default ({ identity='' })=>(
    <div className={styles.logo}>
        <div className={styles.title}>
            <h3>{ formatMessage({ id: 'app.WebSiteName' }) } </h3>
            <img src={light} alt='logo'/>
        </div>
        <div className={styles.subTitle}>({identity})</div>
    </div>
)