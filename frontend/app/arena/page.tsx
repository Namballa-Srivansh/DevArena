import { getProblems } from "@/app/actions";
import ArenaLobbyClient from "@/components/arena-lobby-client";

export const dynamic = "force-dynamic";

export default async function ArenaLobby() {
  const challenges = await getProblems();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ArenaLobbyClient initialChallenges={challenges} />
    </div>
  );
}
