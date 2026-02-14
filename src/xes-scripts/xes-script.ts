import {injectTitle} from "./title.ts";
import {injectMenu} from "./menu.ts";
import {injectHiddenComments} from "./hidden-comment.ts";

export function doInject() {
    injectTitle().then();
    injectHiddenComments().then();
    injectMenu().then();
}