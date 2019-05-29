import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import styles from './GridContent.less';

class GridContent extends PureComponent {
  render() {
    const { offset=true, contentWidth, children, contentStyle } = this.props;
    let className = classnames(styles.main, {
      [styles.wide]: contentWidth === 'Fixed'
    });
    return (
      <div className={className}>
        <div className={`${offset ? styles.offset : ''}`} style={{...contentStyle}}>{children}</div>
      </div>
    );
  }
}

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(GridContent);
