# A WSL RootFs with `docker`

To install:

- Download tarball from releases: `https://github.com/brad-jones/wsl-rootfs-docker/releases/download/<TAG>/wsl-rootfs-docker_<TAG>.tar.gz`
- Optionally verify your download with: `gh attestation verify --owner brad-jones ./wsl-rootfs-docker_<TAG>.tar.gz`
  - see: <https://github.blog/changelog/2024-06-25-artifact-attestations-is-generally-available/>
- Create WSL VM: `wsl --import docker ~/.wsl/docker ~/Downloads/wsl-rootfs-docker_<TAG>.tar.gz`
