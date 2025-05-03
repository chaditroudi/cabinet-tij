// src/hooks/useAppSelector.js

import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../config/store"; // Adjust the path if necessary

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
