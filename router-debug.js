import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

console.log('/'.repeat(100));
console.log('ROUTER.JS');
console.log('/'.repeat(100));

export function createRouter(ssrContext, createDefaultRouter, routerOptions) {
  const router = createDefaultRouter(ssrContext);
  const options = routerOptions || router.options;

  console.log('%'.repeat(100));
  console.log(router);
  console.log(options);
  console.log(options.routes);
  console.log(JSON.stringify(options.routes));

  const newOptions = { ...options };
  //   newOptions.mode = 'history';
  //   newOptions.mode = 'hash';

  const newRoutes = options.routes;
  console.log(newRoutes);
  //   newRoutes.push({ path: '*', redirect: '/' });
  //   newRoutes[0].redirect = '/countries/plot';

  newOptions.routes = newRoutes;

  console.log('>>>>>>>> routes');
  console.log(newOptions);

  // VueRouter api https://router.vuejs.org/api/#router-construction-options

  const newRouter = new Router(newOptions);
  //   const newRouter = new Router({ routes: newRoutes });

  newRouter.beforeEach((to, from, next) => {
    console.log('>>>>>>>>>> ROUTER INTERCEPT');
    console.log('>>> from');
    console.log(from);
    // console.log(JSON.stringify(from));
    console.log('>>> to');
    console.log(to);
    // console.log(JSON.stringify(to));
    next();
  });

  console.log('>>>>>>>> newRouter');
  console.log(newRouter);

  return newRouter;

  //   return new Router({
  //     ...options
  //     //   routes: fixRoutes(options.routes)
  //   });
}
