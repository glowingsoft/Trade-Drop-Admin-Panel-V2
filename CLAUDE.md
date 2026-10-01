# Claude Safety Guidelines

## CRITICAL EXECUTION RESTRICTIONS
- NEVER execute, suggest, or plan any destructive commands such as `rm`, `rmdir`, `git clean`, or any file deletion scripts.
- NEVER run any operations referencing the home directory path (`~/`) or the root folder (`/`). You are strictly scoped to the active workspace project directory.
- You do not possess autonomous permissions for shell executions. Every single terminal operation or code rewrite must explicitly ask the user for confirmation.
- If you notice repetitive tasks, cleanups, or refactoring that involve deleting folders, HALT immediately, explain your plan to the user, and wait for confirmation. Do not try to automate it in a single pass.

## CODE STYLE
- Do not add comments.

## TOASTS
- Always show the backend message in the toast.
- Never invent frontend copy such as "Update success!" or "Something went wrong".
- Success: `toast.success(response.message)` (or `response.data.message` if that is where the API puts it).
- Errors: `handleApiError(error)` from `src/utils/errorHandler.js`. It reads `error.data.message`.
- If the backend does not send a message, do not toast a made-up one.

## API INTEGRATION PATTERN

This app uses RTK Query. Do not call `fetch`/`axios` from views. Follow the existing auth/profile flow.

### Layers
1. `src/store/apiRoutes.js` — endpoint paths only.
2. `src/store/Reducer/*.js` — `createApi` slice with `createCustomFetchBaseQuery()`.
3. `src/store/store.js` — register the slice reducer and middleware.
4. `src/pages/...` — Helmet title + section view. No API logic.
5. `src/sections/...` — Zod + react-hook-form + RTK hook + unwrap + toast + navigate.

### Transport
- Base URL: `import.meta.env.VITE_BASE_URL`
- Shared base query: `src/store/baseQuery.js`
- Authenticated requests send `Authorization: Bearer <token>` from `state.user.user.token`
- Login also sends `x-admin-access-token` from `VITE_BASE_ADMIN_ACCESS_TOKEN`
- 401 (except on the sign-in page) logs out and redirects to `/`
- Logged-in user is persisted in the `user` slice via redux-persist

### Adding an endpoint
1. Add the path to `API_ROUTES`.
2. Add a `query` or `mutation` on the matching slice (`auth.js`, `users-api.js`, `upload-api.js`, `categories-api.js`, `wallets-api.js`). Create a new slice only when the resource is new.
3. If the slice is new, register it in `src/store/store.js`.
4. Export the generated hook (`useXMutation` / `useXQuery`).
5. Use the hook in the section view.

### View usage
```js
const [mutate] = useSomethingMutation();

const onSubmit = handleSubmit(async (data) => {
  try {
    const response = await mutate(payload).unwrap();
    toast.success(response.message);
  } catch (error) {
    handleApiError(error);
  }
});
```

- Validate with Zod on the form.
- Call `.unwrap()`.
- Auth payload data lives on `response.data`.
- Guards use Redux `user` and `user.permission` (`src/auth/guard/custom-auth-guard.jsx`), not the template JWT auth context.

### Uploads
- Reuse `Field.UploadImage` (`src/components/upload/upload-image.jsx`) for pick/preview/validation only. It stores a `File` on the form.
- On Save, if the field is a `File`, `POST` `FormData` `{ file }` to `/upload` via `useUploadFileMutation`.
- Put `response.data.file` (Cloudinary public id) on the entity payload. Profile update uses `profileIcon`.
- Preview helpers and size/type limits live in `src/constants/upload.js`. Use `getDisplayImage(value)` for UI image `src` (`noimg.png` / `xyz.jpg` / empty → placeholder).

### Current slices
- `src/store/Reducer/auth.js` — login, forgot/verify/reset/change password
- `src/store/Reducer/users-api.js` — `GET /admin/users`, `PUT /admin/users/{id}`
- `src/store/Reducer/faqs-api.js` — `GET/POST/PUT/DELETE /admin/faqs`
- `src/store/Reducer/settings-api.js` — terms / about / privacy settings
- `src/store/Reducer/categories-api.js` — catalog categories + timing chips
- `src/store/Reducer/announcements-api.js` — announcements + notification segments
