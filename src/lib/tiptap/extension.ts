import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

export const HoverExtension = Extension.create({
  name: "hover",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("hover"),
        props: {
          handleDOMEvents: {
            mouseover(view, event) {
              // do whatever you want

              console.log("HOVER NOW");
              // console.log(JSON.stringify(view));
              // console.log(JSON.stringify(event));
            },
          },
        },
      }),
    ];
  },
});
