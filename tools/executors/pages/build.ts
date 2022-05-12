import { ExecutorContext } from '@nrwl/devkit';
import { checkDependencies } from '@nrwl/js/src/utils/check-dependencies';
import { CopyAssetsHandler } from '@nrwl/js/src/utils/copy-assets-handler';
import {
  ExecutorOptions,
  NormalizedExecutorOptions,
} from '@nrwl/js/src/utils/schema';
import { addTslibDependencyIfNeeded } from '@nrwl/js/src/utils/tslib-dependency';
import { compileTypeScriptFiles } from '@nrwl/js/src/utils/typescript/compile-typescript-files';
import { updatePackageJson } from '@nrwl/js/src/utils/update-package-json';
import { watchForSingleFileChanges } from '@nrwl/js/src/utils/watch-for-single-file-changes';
import {
  FileInputOutput,
  assetGlobsToFiles,
} from '@nrwl/workspace/src/utilities/assets';
import { join, resolve } from 'path';

export function normalizeOptions(
  options: ExecutorOptions,
  contextRoot: string,
  sourceRoot?: string,
  projectRoot?: string
): NormalizedExecutorOptions {
  const outputPath = join(contextRoot, options.outputPath);

  if (options.watch == null) {
    options.watch = false;
  }

  const files: FileInputOutput[] = assetGlobsToFiles(
    options.assets,
    contextRoot,
    outputPath
  );

  return {
    ...options,
    root: contextRoot,
    sourceRoot,
    projectRoot,
    files,
    outputPath,
    tsConfig: join(contextRoot, options.tsConfig),
    mainOutputPath: resolve(
      outputPath,
      options.main.replace(`${projectRoot}/`, '').replace('.ts', '.js')
    ),
  };
}

export async function* tscExecutor(
  _options: ExecutorOptions,
  context: ExecutorContext
) {
  const { sourceRoot, root } = context.workspace.projects[context.projectName];
  const options = normalizeOptions(_options, context.root, sourceRoot, root);

  const { projectRoot, tmpTsConfig, target, dependencies } = checkDependencies(
    context,
    _options.tsConfig
  );

  if (tmpTsConfig) {
    options.tsConfig = tmpTsConfig;
  }

  addTslibDependencyIfNeeded(options, context, dependencies);

  const assetHandler = new CopyAssetsHandler({
    projectDir: projectRoot,
    rootDir: context.root,
    outputDir: _options.outputPath,
    assets: _options.assets,
  });

  if (options.watch) {
    const disposeWatchAssetChanges =
      await assetHandler.watchAndProcessOnAssetChange();
    const disposePackageJsonChanged = await watchForSingleFileChanges(
      join(context.root, projectRoot),
      'package.json',
      () => updatePackageJson(options, context, target, dependencies)
    );
    process.on('exit', async () => {
      await disposeWatchAssetChanges();
      await disposePackageJsonChanged();
    });
    process.on('SIGTERM', async () => {
      await disposeWatchAssetChanges();
      await disposePackageJsonChanged();
    });
  }

  return yield* compileTypeScriptFiles(options, context, async () => {
    await assetHandler.processAllAssetsOnce();
    updatePackageJson(options, context, target, dependencies);
  });
}

export default tscExecutor;
