import dashboard from '~/js/generic/dashboard';
import log from '~/js/generic/log';
import { buildLink } from '~/js/generic/app-state';

export default function({ store, route, redirect }) {
  log.funcStart('MIDDLEWARE active-route');

  const conf = store.getters['dashboard/conf'];
  if (!conf) return;

  const activeTab = store.getters['dashboard/activeTab'];

  const path = dashboard.defaultRoute(conf, route, activeTab);

  if (path) {
    const link = buildLink({ path, route });

    log.funcEnd('MIDDLEWARE active-route', link);

    redirect(link);
  }
}
