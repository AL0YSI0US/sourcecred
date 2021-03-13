// @flow

import * as P from "../util/combo";
import {Plugin} from "./plugin";
import {bundledPlugins as getAllBundledPlugins} from "./bundledPlugins";
import * as pluginId from "./pluginId";

export type InstanceConfig = {|
  +bundledPlugins: Map<
    string,
    {|+plugin: Plugin, +type: pluginId.PluginId|}
  >,
|};

type RawInstanceConfig = {|
  // Plugin identifier, like `sourcecred/identity`. Version number is
  // implicit from the SourceCred version. This is a stopgap until we have
  // a plugin system that admits external, dynamically loaded
  // dependencies.
  +bundledPlugins: $ReadOnlyArray<{|
    +type: pluginId.PluginId,
    +uniqueFolderName: string,
  |}>,
|};

const rawParser: P.Parser<RawInstanceConfig> = P.object({
  bundledPlugins: P.array(
    P.object({type: pluginId.parser, uniqueFolderName: P.string})
  ),
});

function upgrade(raw: RawInstanceConfig): InstanceConfig {
  const uniqueFolderNames = raw.bundledPlugins.map((x) => x.uniqueFolderName);
  const anyDuplicate = uniqueFolderNames.find(
    (x, index) => uniqueFolderNames.indexOf(x) !== index
  );
  if (anyDuplicate) {
    throw new Error("duplicate folder name: " + anyDuplicate);
  }
  const allBundledPlugins = getAllBundledPlugins();
  const bundledPlugins = new Map();
  for (const {type, uniqueFolderName} of raw.bundledPlugins) {
    const plugin = allBundledPlugins[type]();
    if (plugin == null) {
      throw new Error("bad bundled plugin: " + JSON.stringify(type));
    }
    bundledPlugins.set(uniqueFolderName, {plugin, type});
  }
  return {bundledPlugins};
}

export const parser: P.Parser<InstanceConfig> = P.fmap(rawParser, upgrade);
