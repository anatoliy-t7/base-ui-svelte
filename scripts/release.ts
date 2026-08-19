#!/usr/bin/env bun
/**
 * Cut a GitHub Release with a short list of what landed since the last tag.
 *
 *   bun run release              # patch bump (0.1.0 → 0.1.1)
 *   bun run release -- --minor
 *   bun run release -- --major
 *   bun run release -- --dry-run
 *   bun run release -- --publish   # also npm publish both packages
 */

import { $ } from 'bun';
import { readFileSync, writeFileSync } from 'node:fs';

const PACKAGE_JSON_PATHS = [
	'packages/svelte/package.json',
	'packages/styles/package.json',
] as const;

const SKIP_SUBJECT = /^(merge |chore:\s*release\b|chore:\s*bump\b)/i;

type Bump = 'patch' | 'minor' | 'major';

function parseArgs(argv: string[]): {
	bump: Bump;
	dryRun: boolean;
	publish: boolean;
} {
	let bump: Bump = 'patch';
	let dryRun = false;
	let publish = false;

	for (const arg of argv) {
		if (arg === '--patch' || arg === '--minor' || arg === '--major') {
			bump = arg.slice(2) as Bump;
			continue;
		}
		if (arg === '--dry-run') {
			dryRun = true;
			continue;
		}
		if (arg === '--publish') {
			publish = true;
			continue;
		}
		if (arg === '--help' || arg === '-h') {
			console.log(`Usage: bun run release -- [--patch|--minor|--major] [--dry-run] [--publish]

Creates a git tag and GitHub Release. Notes are a short bullet list of
commits since the previous tag (feat/fix/docs/refactor/perf/test).`);
			process.exit(0);
		}
		console.error(`Unknown flag: ${arg}`);
		process.exit(1);
	}

	return { bump, dryRun, publish };
}

function bumpVersion(version: string, bump: Bump): string {
	const parts = version.split('.').map((n) => Number(n));
	if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n))) {
		throw new Error(`Invalid version: ${version}`);
	}
	const [major, minor, patch] = parts;
	if (bump === 'major') return `${major + 1}.0.0`;
	if (bump === 'minor') return `${major}.${minor + 1}.0`;
	return `${major}.${minor}.${patch + 1}`;
}

function readPackageVersion(path: string): string {
	const pkg = JSON.parse(readFileSync(path, 'utf8')) as { version?: unknown };
	if (typeof pkg.version !== 'string') {
		throw new Error(`No version in ${path}`);
	}
	return pkg.version;
}

function writePackageVersion(path: string, version: string): void {
	const raw = readFileSync(path, 'utf8');
	const next = raw.replace(/"version":\s*"[^"]+"/, `"version": "${version}"`);
	if (next === raw) {
		throw new Error(`Could not update version in ${path}`);
	}
	writeFileSync(path, next);
}

function subjectToBullet(subject: string): string | null {
	const trimmed = subject.trim();
	if (!trimmed || SKIP_SUBJECT.test(trimmed)) return null;

	const conventional = trimmed.match(
		/^(feat|fix|docs|refactor|perf|test|chore|style|build|ci)(?:\([^)]+\))?:\s*(.+)$/i,
	);
	const body = conventional ? conventional[2] : trimmed;
	const type = conventional?.[1]?.toLowerCase();

	if (type === 'chore' || type === 'style' || type === 'build' || type === 'ci') {
		return null;
	}

	const sentence = body.charAt(0).toUpperCase() + body.slice(1);
	return sentence.replace(/\.\s*$/, '');
}

function notesFromSubjects(subjects: string[], version: string): string {
	const bullets: string[] = [];
	const seen = new Set<string>();

	for (const subject of subjects) {
		const bullet = subjectToBullet(subject);
		if (!bullet || seen.has(bullet.toLowerCase())) continue;
		seen.add(bullet.toLowerCase());
		bullets.push(`- ${bullet}`);
	}

	if (bullets.length === 0) {
		bullets.push('- Maintenance and internal updates');
	}

	return `## What's in ${version}\n\n${bullets.join('\n')}\n`;
}

async function gitText(args: string[]): Promise<string> {
	const result = await $`git ${args}`.quiet().nothrow();
	if (result.exitCode !== 0) {
		throw new Error(result.stderr.toString().trim() || `git ${args.join(' ')} failed`);
	}
	return result.stdout.toString().trim();
}

async function main(): Promise<void> {
	const { bump, dryRun, publish } = parseArgs(process.argv.slice(2));

	const versions = PACKAGE_JSON_PATHS.map(readPackageVersion);
	if (new Set(versions).size !== 1) {
		throw new Error(
			`Package versions differ: ${PACKAGE_JSON_PATHS.map((p, i) => `${p}=${versions[i]}`).join(', ')}`,
		);
	}

	const current = versions[0];
	const next = bumpVersion(current, bump);
	const tag = `v${next}`;

	const lastTag = await gitText(['tag', '--list', 'v*', '--sort=-v:refname'])
		.then((out) => out.split('\n').find(Boolean) ?? '')
		.catch(() => '');

	const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
	const log = lastTag
		? await gitText(['log', range, '--pretty=format:%s'])
		: await gitText(['log', '--pretty=format:%s']);
	const subjects = log ? log.split('\n') : [];
	const notes = notesFromSubjects(subjects, tag);

	console.log(notes);
	console.log(`Current: ${current}  →  ${tag}  (${bump})`);
	if (lastTag) console.log(`Commits since ${lastTag}: ${subjects.length}`);

	if (dryRun) {
		console.log('\nDry run — no tag, commit, or GitHub release.');
		return;
	}

	const status = await gitText(['status', '--porcelain']);
	if (status) {
		throw new Error('Working tree is dirty. Commit or stash first.');
	}

	for (const path of PACKAGE_JSON_PATHS) {
		writePackageVersion(path, next);
	}

	await $`git add ${PACKAGE_JSON_PATHS.slice()}`;
	await $`git commit -m ${`chore: release ${tag}`}`;
	await $`git tag -a ${tag} -m ${tag}`;
	await $`git push origin HEAD`;
	await $`git push origin ${tag}`;

	const gh = await $`gh release create ${tag} --title ${tag} --notes ${notes}`.nothrow();
	if (gh.exitCode !== 0) {
		throw new Error(gh.stderr.toString().trim() || 'gh release create failed');
	}

	console.log(
		`\nRelease ${tag}: https://github.com/anatoliy-t7/base-ui-svelte/releases/tag/${tag}`,
	);

	if (publish) {
		await $`bun run build`;
		await $`bun run publint`;
		await $`npm publish -w base-ui-svelte`;
		await $`npm publish -w @base-ui-svelte/styles`;
		console.log('Published base-ui-svelte and @base-ui-svelte/styles to npm.');
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
