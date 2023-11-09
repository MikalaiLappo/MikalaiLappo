import { readFileSync, writeFileSync } from 'fs'
const USERNAME = 'MikalaiLappo'
const LANGS_COUNT = 4

const codewarsToSkillicon = {
    sql: 'postgres'
}
const subCodewarsToSkillicons = arr => arr.map(x => codewarsToSkillicon[x]||x)
const getCodewarsInfo = async () => {
    const { leaderboardPosition, ranks, codeChallenges } = await (await fetch(`https://www.codewars.com/api/v1/users/${USERNAME}`)).json()
    
    const { name: overallRank } = ranks.overall
    const topLanguages = Object.entries(ranks.languages).sort(([_1, stats1], [_2, stats2]) => stats2.score - stats1.score).slice(0, LANGS_COUNT).map(([lang, _]) => lang)
    const { totalCompleted } = codeChallenges

    return { 
        leaderboardPosition, 
        overallRank, 
        topLanguages: subCodewarsToSkillicons(topLanguages), 
        totalCompleted 
    }
}


const templifyKey = prefix => key => `{{.${(prefix ?? '') + key}.}}`

async function run() {
    const codewarsJson = await getCodewarsInfo()
    const template = readFileSync('README.tmpl.md')
    
    let readme = template.toString()
    for (const [k,v] of Object.entries(codewarsJson)) {
	    readme = readme.replace(templifyKey('codewars-')(k), Array.isArray(v) ? v.join(',') : v)
    }
    
    writeFileSync('README.md', readme)
}

run().then(() => {})
