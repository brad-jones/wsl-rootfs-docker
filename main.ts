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

console.log(releasedTags);

if (releasedTags.includes(latestTag)) {
  $.log(`Nothing to do, tag already published`);
  Deno.exit(0);
}

await $`docker export $(docker create docker:${latestTag}) | gzip > rootfs.tar.gz`;
/*
- run: docker export $(docker create docker:latest) | gzip > rootfs.tar.gz
      - run: tar -tf rootfs.tar.gz
      - run: sha256sum -b rootfs.tar.gz
*/
