import { useDispatch, useSelector } from "react-redux";

/**
 * Typed Hooks for Redux
 *
 * Why create these?
 * - Provides type safety (if using TypeScript)
 * - Makes it easier to use Redux in components
 * - Avoids repeating the same code in every component
 *
 * Usage in components:
 * const dispatch = useAppDispatch();
 * const { user, isAuthenticated } = useAppSelector((state) => state.auth);
 */

// Typed version of useDispatch
export const useAppDispatch = useDispatch;

// Typed version of useSelector
export const useAppSelector = useSelector;


