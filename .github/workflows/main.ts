import $ from "@david/dax";
import { z } from "zod";

const latestTag = z.object({ Tags: z.array(z.string()) })
  .parse(await $`skopeo list-tags docker://docker.io/docker`.json())
  .Tags.filter((_) => _.match(/^\d+\.\d+\.\d+-dind-alpine.*$/))
  .reverse()[0];

$.log(`Latest version from registry: ${latestTag}`);

const releasedTags = z.array(z.object({ tagName: z.string() }))
  .parse(await $`gh release list -R ${Deno.env.get("GITHUB_REPOSITORY")!} --json tagName`.json())
  .map((_) => _.tagName);

if (releasedTags.includes(latestTag)) {
  $.log(`Nothing to do, tag already published`);
  Deno.exit(0);
}

await Deno.mkdir("dist");
const rootfsFileName = `wsl-rootfs-docker_${latestTag}.tar.gz`;
await $`docker buildx b --build-arg ${`TAG=${latestTag}`} --output type=tar ./src | gzip >./dist/${rootfsFileName}`;

const digest = (await $`sha256sum -b ./dist/${rootfsFileName}`.text()).split(" ")[0];
await Deno.writeTextFile(`./dist/${rootfsFileName}.sha256`, digest);
$.log(`Digest sha256:${digest}`);

await $`gh release create -R ${Deno.env.get("GITHUB_REPOSITORY")!} ${latestTag} --generate-notes ./dist/${rootfsFileName} ./dist/${rootfsFileName}.sha256`;
