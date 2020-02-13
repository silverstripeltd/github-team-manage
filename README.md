# Github Team Management

Little helper to bulk manage team assignments to repos.

## Installation

```
git clone 
npm link
```

## Configuration

Use `.env` or process env vars to configure.

 * `GITHUB_API_TOKEN`: OAuth token

## Usage

```
github-team-manage --help
```

The most common usage is to list some repos in an org,
and then bulk-add those to a team. This requires chained commands with `xargs`.

```
github-team-manage list-repos my-org \
  |  xargs github-team-manage add-repos my-org my-team triage --repos
```