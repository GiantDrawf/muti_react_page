import React, { PureComponent } from 'react';
import errorBoundary from '@ifeng/errorBoundary';
import styles from './index.css';
import wxSDK from 'wxSDK';

/**
 * Layout
 */
class Layout extends PureComponent {
    async componentDidMount() {
        this.wxUtils = new wxSDK();
        await this.wxUtils.isLogin();
    }

    render() {
        return (
            <div>
                <p className={styles.font}>1123</p>
            </div>
        );
    }
}

export default errorBoundary(Layout);
