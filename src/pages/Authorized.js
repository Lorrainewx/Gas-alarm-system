import React from 'react';
import Redirect from 'umi/redirect';
import Link from 'umi/link';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { Exception } from 'ant-design-pro';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { getAuthority } from '@/utils/authority';

const redirectArr = {
  'operaman': '/operamanHome',
  'projectLeader': '/projectLeaderHome',
  'administrator': '/dashboard',
  'guest': '/user/login'
}

function AuthComponent({ children, location, routerData }) {
  const auth = getAuthority();
  const isLogin = auth && auth[0] !== 'guest';
  const rolename = isLogin?auth[0]:'guest';

  const getRouteAuthority = (path, routeData) => {
    let authorities;
    routeData.forEach(route => {
      // match prefix
      if (pathToRegexp(`${route.path}(.*)`).test(path)) {
        authorities = route.authority || authorities;

        // get children authority recursively
        if (route.routes) {
          authorities = getRouteAuthority(path, route.routes) || authorities;          
        }
      }
    });
    return authorities;
  };

  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={!!isLogin ? (
        <Exception
          type="403"
          desc={formatMessage({ id: 'app.exception.description.403' })}
          linkElement={Link}
          backText={formatMessage({ id: 'app.exception.back' })}
          redirect={redirectArr[rolename]}
        />
      ) : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
}
export default connect(({ menu: menuModel }) => ({
  routerData: menuModel.routerData,
}))(AuthComponent);
