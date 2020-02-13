#!/usr/bin/env node

const yargs = require('yargs');
const { Octokit } = require("@octokit/core");
const { paginateRest } = require("@octokit/plugin-paginate-rest");
const dotenv = require('dotenv');

dotenv.config();

function getApi() {
  if (!process.env.GITHUB_API_TOKEN) {
    throw 'Requires GITHUB_API_TOKEN';
  }

  const MyOctokit = Octokit.plugin(paginateRest);
  return new MyOctokit({
    auth: process.env.GITHUB_API_TOKEN
  });
};

async function listRepos({org, exclude}) {
  const api = getApi();
  const repos = await api.paginate(
    "GET /orgs/:owner/repos", 
    {
      owner: org,
      per_page: 100,
      // Required for topics, see https://developer.github.com/v3/repos/#list-your-repositories
      mediaType: {
        previews: ['mercy']
      }
    }
  );
  
  repos
    .filter(repo => {
      const foundExcluded = (repo.topics || [])
        .filter(topic => exclude.includes(topic));
      return foundExcluded.length == 0;
    })
    .forEach(repo => {
      // Output names to stdout (for easy piping)
      console.log(repo.full_name);
    });
};

async function addRepos({org, team, permission, repos}) {
  const api = getApi();
  for (const repo of repos) {
    console.log(`Updating ${repo}`);
    await api.request("PUT /orgs/:org/teams/:team/repos/:repo", {
      org,
      team,
      repo,
      permission
    });
  }
};

yargs
  .scriptName('github-team-manage')
  .usage('$0 <cmd> [args]')
  .command(
    'list-repos [org]',
    'List all repos in an organisation',
    (yargs) => {
      yargs.positional('org', {
        type: 'string',
        describe: 'Github organisation'
      })
      yargs.option('exclude', {
        type: 'array',
        describe: 'Exclude certain repo topics'
      })
    },
    listRepos
  )
  .command(
    'add-repos [org] [team] [permission]',
    'Add multiple repos to a team. Reads repos from stdin',
    (yargs) => {
      yargs.positional('org', {
        type: 'string',
        describe: 'Github organisation'
      })
      yargs.positional('team', {
        type: 'string',
        describe: 'Team identifier in the org'
      })
      yargs.positional('permission', {
        type: 'string',
        describe: 'Permission (pull, push, triage, maintain, admin)'
      })
      // Meh. https://github.com/yargs/yargs/issues/388
      yargs.option('repos', {
        type: 'array',
        demand: true,
        describe: 'Repo names'
      })
    },
    addRepos
  )
  .argv;