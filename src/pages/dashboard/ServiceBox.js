import react from 'react';
import { Tooltip } from 'antd';

import styles from './Dashboard.less';

export default ({ data }) => {
    if(!Array.isArray(data)) return null;

    function toArray (obj) {
        let arr = [];
        for(let i in obj){
            arr.push({ key: i, value: obj[i] });
        }
        return arr;
    }
    
    return (
        <div className={styles.serviceContainer}>
            {
                data.map(({ title, status, details })=>(
                    <div className={styles.statusBox} key={title}>
                        <div className={styles.title}>{title}</div>
                        <div className={`${styles.status} ${/UP/i.test(status) ? styles.success : styles.error}`}>{status}</div>
                        <div>
                        {
                            toArray(details).map(({ key, value })=>{
                                value = String(value).replace(/\s/g, '');
                                return value.length < 15
                                ? (<p key={key}>{key}: {value}</p>)
                                : (
                                    <Tooltip title={<p>{value}</p>} key={key}>
                                        <p>{key}: {value.substring(0, 12)}...</p>
                                    </Tooltip>
                                )
                            })
                        }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}