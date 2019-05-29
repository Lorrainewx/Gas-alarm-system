import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import styles from './styles.less'

const { TabPane } = Tabs;

class TableContent extends PureComponent {
  render() {
    const { title = '', children, extraContent, style, contentStyle } = this.props;
    return (
      <div className={styles.tabPane} style={{ ...style }}>
        <div className={styles.title}>
          <div className={styles.text}>{title}</div>
          <div className={styles.extraContent}>
            {
              !!extraContent ? extraContent : null
            }
          </div>
        </div>
        <div className={styles.content} style={{ ...contentStyle }}>{children}</div>
      </div>
    );
  }
}

export default TableContent;
