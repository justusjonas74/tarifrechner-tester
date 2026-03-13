{
  description = "Nix based development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11"; # Stable
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            pnpm
          ];

          shellHook = ''
            echo "Nix based development environment loaded."
            pnpm --version
            export PNPM_HOME="$HOME/.local/share/pnpm"
            export PATH="$PNPM_HOME:$PATH"
          '';
        };
      });
}
