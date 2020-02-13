# Github Team Management

Little helper to bulk manage team assignments to repos.

## Installation

```
git clone git@github.com:silverstripeltd/github-team-manage.git
cd github-team-manage
npm link
```

## Configuration

Use `.env` or process env vars to configure.

 * `GITHUB_API_TOKEN`: OAuth token

## Usage

```
github-team-manage --help

github-team-manage <cmd> [args]

Commands:
  github-team-manage list-repos [org]       List all repos in an organisation
  github-team-manage add-repos [org]        Add multiple repos to a team. Reads
  [team] [permission]                       repos from stdin

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

The most common usage is to list some repos in an org,
and then bulk-add those to a team. This requires chained commands with `xargs`.

```
github-team-manage list-repos my-org \
  |  xargs github-team-manage add-repos my-org my-team my-permission --repos
```