import {
   convexAuthNextjsMiddleware,
   createRouteMatcher,
   nextjsMiddlewareRedirect
} from "@convex-dev/auth/nextjs/server";

const isUserAuthRoute = createRouteMatcher(["/login", "/signup"]);
const isDashboardAuthRoute = createRouteMatcher(["/merchant", "/admin"]);

const isProtectedUserRoute = createRouteMatcher(["/", "/stores/:slug"]);

const isProtectedMerchantRoute = createRouteMatcher([
   "/dashboard",
   "/manage-inventory",
   "/manage-posts",
   "/received-orders",
   "/posts/create",
   "/posts/:id",
   "/posts/:id/edit",
   "/stores/create"
]);

const isProtectedAdminRoute = createRouteMatcher([
   "/manage-orders",
   "/manage-users",
   "/merchant-requests",
   "/posts",
   "/stores",
   "/products"
]);

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
   const isAuthenticated = await convexAuth.isAuthenticated();

   if (isUserAuthRoute(req) && isAuthenticated) {
      return nextjsMiddlewareRedirect(req, "/");
   }

   if (isProtectedUserRoute(req) && !isAuthenticated) {
      return nextjsMiddlewareRedirect(req, "/login");
   }

   if (isDashboardAuthRoute(req) && isAuthenticated) {
      return nextjsMiddlewareRedirect(req, "/dashboard");
   }

   if (isProtectedMerchantRoute(req) && !isAuthenticated) {
      return nextjsMiddlewareRedirect(req, "/merchant");
   }

   if (isProtectedAdminRoute(req) && !isAuthenticated) {
      return nextjsMiddlewareRedirect(req, "/admin");
   }
});

export const config = {
   // The following matcher runs middleware on all routes
   // except static assets.
   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
