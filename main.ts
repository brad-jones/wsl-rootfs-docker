import $ from "@david/dax";
import { z } from "zod";

const latestTag = z.object({ Tags: z.array(z.string()) })
  .parse(await $`skopeo list-tags docker://docker.io/docker`.json())
  .Tags.filter((_) => _.match(/^\d+\.\d+\.\d+-dind-alpine.*$/))
  .reverse()[0];

$.log(`Latest version from registry: ${latestTag}`);

/*
- run: docker export $(docker create docker:latest) | gzip > rootfs.tar.gz
      - run: tar -tf rootfs.tar.gz
      - run: sha256sum -b rootfs.tar.gz
*/
