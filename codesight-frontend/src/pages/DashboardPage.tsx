
import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router'
import { useActiveSessions, useCreateSession, usePastSessions } from '../hooks/useSessions';
import Navbar from '../components/Navbar';
import ActiveSessions from '../components/ActiveSessions';
import StatsCards from '../components/StatsCard';
import WelcomeSection from '../components/WelcomeSection';
import type { Session } from '../interfaces';
import PastSessions from '../components/PastSessions';
import CreateSessionModal from '../components/CreateSessionModal';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {user} = useUser();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [roomConfig, setRoomConfig] = useState<{problem:string, difficulty:string}>({problem:"", difficulty:""})

  const createSessionMutation = useCreateSession();
  const {data:activeSessionsData, isLoading:loadingActiveSessions} = useActiveSessions();
  const {data:pastSessionsData, isLoading:loadingPastSessions} = usePastSessions();


  const handleCreateRoom = () => {
    if(!roomConfig.problem || !roomConfig.difficulty)return;
    createSessionMutation.mutate({
      problem: roomConfig.problem, difficulty:roomConfig.difficulty
    },
    {
      onSuccess:(data) => {
        setShowCreateModal(false);
        navigate(`/sessions/${data.session._id}`);
      }
    })
  }

    const activeSessions: Session[] = activeSessionsData?.sessions || [];
    const pastSessions: Session[] = pastSessionsData?.sessions || [];

  const isUserInSession = (session: Session) => {
    if (!user?.id) return false;

    return (
      session.host?.clerkId === user.id ||
      session.participant?.clerkId === user.id
    );
  };
  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              pastSessionsCount={pastSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <PastSessions
            sessions={pastSessions}
            isLoading={loadingPastSessions}
          />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage