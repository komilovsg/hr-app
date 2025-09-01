'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '@hr-app/shared';
import TeamModal from '@/components/TeamModal';

interface TeamButtonProps {
  user: User;
}

export default function TeamButton({ user }: TeamButtonProps) {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/team/${user.team}`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [user.team]);

  const teamMembersCount = teamMembers.filter(member => member.id !== user.id).length;
  const isManager = user.role === 'manager';

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
      >
        <span className="mr-2">👥 КОМАНДА</span>
        <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
          {loading ? '...' : teamMembersCount}
        </span>
      </button>

      <TeamModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        teamMembers={teamMembers}
        currentUser={user}
        teamName={user.team}
      />
    </>
  );
}
