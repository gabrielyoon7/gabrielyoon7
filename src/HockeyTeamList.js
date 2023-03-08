const teams = [
  {
    id: 0,
    name: 'Calvin Hawkins',
    city: 'calvin.hawkins@example.com',
    logo:
      'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

function HockeyTeamItem({ team }) {
  return (
    <li className="py-4 flex">
      <img className="h-10 w-10 rounded-full" src={team.logo} alt="" />
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">{team.name}</p>
        <p className="text-sm text-gray-500">{team.city}</p>
      </div>
    </li>
  )
}

export default function HockeyTeamList() {
  return (
    <ul className="divide-y divide-gray-200">
      {teams.map((team) => <HockeyTeamItem key={team.id} team={team} />)}
    </ul>
  )
}