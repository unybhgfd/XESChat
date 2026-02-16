import { injectTitle } from "./scripts/title.ts";
import { injectMenu } from "./scripts/menu.ts";
import { injectHiddenComments } from "./scripts/hidden-comment.ts";

export function doInject() {
    injectTitle().then();
    injectHiddenComments().then();
    injectMenu().then();
}
