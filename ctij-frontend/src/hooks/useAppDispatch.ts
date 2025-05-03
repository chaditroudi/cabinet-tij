// src/hooks/useAppDispatch.js

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../config/store"; // Adjust the path if necessary

export const useAppDispatch = () => useDispatch<AppDispatch>();
