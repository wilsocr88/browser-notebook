/**
 * Copyright (c) 2024 Craig Wilson <wilsocr88@gmail.com>
 */
import { $ } from "./common";
import addData from "./addData";

// Create a submit event handler so that when the form is submitted the addData() function is run
$("#new-note-form").onsubmit = addData;
