import React, { useState, useEffect } from 'react';
import { useData, EventItem, TeamMemberItem, FacultyItem, GuestItem, CommitteeMemberItem, InaugurationData } from '../../context/DataContext';

interface AdminPanelProps {
  token: string;
  onLogout: () => void;
  onReturnToSite: () => void;
}

type Tab = 'dashboard' | 'about' | 'members' | 'events' | 'media';

export function AdminPanel({ token, onLogout, onReturnToSite }: AdminPanelProps) {
  const { refreshData } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Delete confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Modal / Form state for Member
  const [memberModal, setMemberModal] = useState<Partial<TeamMemberItem> | null>(null);
  // Modal / Form state for Event
  const [eventModal, setEventModal] = useState<Partial<EventItem> | null>(null);
  // Modal / Form state for Faculty
  const [facultyModal, setFacultyModal] = useState<Partial<FacultyItem> | null>(null);
  // Modal / Form state for Guest
  const [guestModal, setGuestModal] = useState<Partial<GuestItem> | null>(null);
  // Modal / Form state for Committee
  const [committeeModal, setCommitteeModal] = useState<Partial<CommitteeMemberItem> | null>(null);
  // Form state for Inauguration
  const [inaugurationForm, setInaugurationForm] = useState<InaugurationData | null>(null);

  // Media items list
  const [mediaList, setMediaList] = useState<{ fileName: string; url: string; sizeBytes: number }[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdminContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStore(data);
        if (data.inauguration) setInaugurationForm(data.inauguration);
      } else if (res.status === 401) {
        onLogout();
      }
    } catch (err) {
      showToast('Failed to load admin content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminContent();
    fetchMedia();
  }, [token]);

  // Helper for image upload to /api/admin/upload
  const handleFileUpload = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fileName: file.name,
              fileData: reader.result,
            }),
          });
          const data = await res.json();
          if (res.ok && data.url) {
            fetchMedia();
            resolve(data.url);
          } else {
            showToast(data.error || 'Upload failed', 'error');
            resolve(null);
          }
        } catch (e) {
          showToast('File upload error', 'error');
          resolve(null);
        }
      };
    });
  };

  // ==========================================
  // INAUGURATION SAVE
  // ==========================================
  const handleSaveInauguration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inaugurationForm) return;
    try {
      const res = await fetch('/api/admin/inauguration', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inaugurationForm),
      });
      if (res.ok) {
        showToast('Inauguration content updated!');
        fetchAdminContent();
        refreshData();
      }
    } catch (err) {
      showToast('Error saving inauguration content', 'error');
    }
  };

  // ==========================================
  // STUDENT MEMBER CRUD
  // ==========================================
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberModal) return;
    const isEdit = !!memberModal.id;
    const endpoint = isEdit ? `/api/admin/members/${memberModal.id}` : '/api/admin/members';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberModal),
      });
      if (res.ok) {
        showToast(isEdit ? 'Member updated!' : 'Member added!');
        setMemberModal(null);
        fetchAdminContent();
        refreshData();
      }
    } catch (err) {
      showToast('Error saving member', 'error');
    }
  };

  const handleDeleteMember = (member: TeamMemberItem) => {
    setConfirmDelete({
      title: 'Delete Student Member',
      message: `Are you sure you want to remove "${member.name}"?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/members/${member.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            showToast('Member removed');
            fetchAdminContent();
            refreshData();
          }
        } catch (e) {
          showToast('Failed to delete member', 'error');
        }
        setConfirmDelete(null);
      },
    });
  };

  // ==========================================
  // EVENT CRUD
  // ==========================================
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventModal) return;
    const isEdit = !!eventModal.id;
    const endpoint = isEdit ? `/api/admin/events/${eventModal.id}` : '/api/admin/events';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventModal),
      });
      if (res.ok) {
        showToast(isEdit ? 'Event updated!' : 'Event created!');
        setEventModal(null);
        fetchAdminContent();
        refreshData();
      }
    } catch (err) {
      showToast('Error saving event', 'error');
    }
  };

  const handleDeleteEvent = (ev: EventItem) => {
    setConfirmDelete({
      title: 'Delete Event',
      message: `Are you sure you want to delete "${ev.title}"?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/events/${ev.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            showToast('Event deleted');
            fetchAdminContent();
            refreshData();
          }
        } catch (e) {
          showToast('Failed to delete event', 'error');
        }
        setConfirmDelete(null);
      },
    });
  };

  // ==========================================
  // FACULTY CRUD
  // ==========================================
  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyModal) return;
    const isEdit = !!facultyModal.id;
    const endpoint = isEdit ? `/api/admin/faculty/${facultyModal.id}` : '/api/admin/faculty';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(facultyModal),
      });
      if (res.ok) {
        showToast(isEdit ? 'Faculty updated!' : 'Faculty added!');
        setFacultyModal(null);
        fetchAdminContent();
        refreshData();
      }
    } catch (err) {
      showToast('Error saving faculty', 'error');
    }
  };

  const handleDeleteFaculty = (fac: FacultyItem) => {
    setConfirmDelete({
      title: 'Delete Faculty Member',
      message: `Remove "${fac.name}" from Faculty Advisory Council?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/faculty/${fac.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            showToast('Faculty deleted');
            fetchAdminContent();
            refreshData();
          }
        } catch (e) {
          showToast('Failed to delete faculty', 'error');
        }
        setConfirmDelete(null);
      },
    });
  };

  // ==========================================
  // MEDIA DELETE
  // ==========================================
  const handleDeleteMedia = (filename: string) => {
    setConfirmDelete({
      title: 'Delete Media Image',
      message: `Permanently delete "${filename}" from server storage?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/media/${filename}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            showToast('File deleted');
            fetchMedia();
          }
        } catch (e) {
          showToast('Failed to delete file', 'error');
        }
        setConfirmDelete(null);
      },
    });
  };

  if (loading && !store) {
    return (
      <div className="min-h-screen bg-[#05040a] flex items-center justify-center text-white text-sm font-medium">
        Loading Admin Panel Dashboard...
      </div>
    );
  }

  const studentCount = store?.studentTeam?.length || 0;
  const facultyCount = store?.faculty?.length || 0;
  const eventCount = store?.events?.length || 0;
  const guestCount = store?.guests?.length || 0;

  return (
    <div className="min-h-screen bg-[#06050c] text-white flex flex-col md:flex-row select-none">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border backdrop-blur-md transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-red-500/20 border-red-500/50 text-red-300'
          }`}
        >
          <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0816] border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#38bdf8] flex items-center justify-center text-sm font-black shadow-lg shadow-[#7c3aed]/30">
              ⚡
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">AgentBlazer Admin</div>
              <div className="text-[11px] text-[#94a3b8]">Control Panel v1.0</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: '📊' },
              { id: 'about', label: 'About Us Sections', icon: '🏛️' },
              { id: 'members', label: 'Student Core Team', icon: '👥' },
              { id: 'events', label: 'Events & Workshops', icon: '🎯' },
              { id: 'media', label: 'Media & Image Storage', icon: '🖼️' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#7c3aed]/25 text-[#38bdf8] border border-[#38bdf8]/40 shadow-md shadow-[#7c3aed]/20'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col gap-2">
          <button
            onClick={onReturnToSite}
            className="w-full py-2 px-3 rounded-xl text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-white/[0.05] transition-colors text-left flex items-center gap-2 cursor-pointer"
          >
            <span>🌐</span>
            <span>View Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left flex items-center gap-2 cursor-pointer"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight mb-2">System Dashboard</h1>
              <p className="text-xs text-[#94a3b8]">Overview of dynamic content across AgentBlazer platform</p>
            </div>

            {/* Counter Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { title: 'Student Team', count: studentCount, icon: '🎓', color: '#38bdf8' },
                { title: 'Faculty Council', count: facultyCount, icon: '👨‍🏫', color: '#c084fc' },
                { title: 'Workshops & Events', count: eventCount, icon: '⚡', color: '#fbbf24' },
                { title: 'Honored Guests', count: guestCount, icon: '🌟', color: '#4ade80' },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl p-5 border border-white/10 bg-[#0c091f]/80 flex items-center justify-between shadow-lg"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">{c.title}</div>
                    <div className="text-3xl font-black mt-1" style={{ color: c.color }}>{c.count}</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xl">
                    {c.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-white/10 bg-[#0c091f]/80 p-6">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Quick Actions</span>
              </h3>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => { setActiveTab('members'); setMemberModal({}); }}
                  className="px-4 py-2.5 rounded-xl bg-[#7c3aed] text-white text-xs font-bold shadow-md hover:bg-[#8b5cf6] transition-all cursor-pointer"
                >
                  + Add Student Member
                </button>
                <button
                  onClick={() => { setActiveTab('events'); setEventModal({}); }}
                  className="px-4 py-2.5 rounded-xl bg-[#38bdf8] text-[#06050c] text-xs font-bold shadow-md hover:bg-[#7dd3fc] transition-all cursor-pointer"
                >
                  + Create New Event
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all cursor-pointer"
                >
                  Edit About Us Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT US MANAGEMENT */}
        {activeTab === 'about' && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">About Us Sections</h1>
              <p className="text-xs text-[#94a3b8]">Edit inauguration banner, honored guests, faculty, and committee</p>
            </div>

            {/* Inauguration Section Form */}
            {inaugurationForm && (
              <form onSubmit={handleSaveInauguration} className="rounded-2xl border border-white/10 bg-[#0c091f]/80 p-6 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-[#38bdf8] border-b border-white/10 pb-3">Inauguration Banner &amp; Keynote Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Heading Title</label>
                    <input
                      type="text"
                      value={inaugurationForm.headingTitle}
                      onChange={(e) => setInaugurationForm({ ...inaugurationForm, headingTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/[0.05] border border-white/10 text-white outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Launch Event Badge</label>
                    <input
                      type="text"
                      value={inaugurationForm.eventBadge}
                      onChange={(e) => setInaugurationForm({ ...inaugurationForm, eventBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/[0.05] border border-white/10 text-white outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Launch Event Title</label>
                  <input
                    type="text"
                    value={inaugurationForm.eventTitle}
                    onChange={(e) => setInaugurationForm({ ...inaugurationForm, eventTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/[0.05] border border-white/10 text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Banner Description</label>
                  <textarea
                    rows={2}
                    value={inaugurationForm.description}
                    onChange={(e) => setInaugurationForm({ ...inaugurationForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/[0.05] border border-white/10 text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Event Description</label>
                  <textarea
                    rows={3}
                    value={inaugurationForm.eventDescription}
                    onChange={(e) => setInaugurationForm({ ...inaugurationForm, eventDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/[0.05] border border-white/10 text-white outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#7c3aed] text-white text-xs font-bold shadow-md hover:bg-[#8b5cf6] transition-all cursor-pointer">
                    Save Inauguration Changes
                  </button>
                </div>
              </form>
            )}

            {/* Faculty Advisory Council */}
            <div className="rounded-2xl border border-white/10 bg-[#0c091f]/80 p-6">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-[#c084fc]">Faculty Advisory Council</h3>
                <button
                  onClick={() => setFacultyModal({})}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7c3aed]/30 border border-[#7c3aed]/50 text-[#c084fc] text-xs font-bold hover:bg-[#7c3aed]/50 cursor-pointer"
                >
                  + Add Faculty
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(store?.faculty || []).map((f: FacultyItem) => (
                  <div key={f.id} className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{f.name}</div>
                      <div className="text-xs text-[#94a3b8]">{f.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFacultyModal(f)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFaculty(f)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/20 text-xs text-red-300 hover:bg-red-500/30 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT CORE TEAM MEMBERS */}
        {activeTab === 'members' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight mb-1">Student Core Team</h1>
                <p className="text-xs text-[#94a3b8]">Manage Student Officers &amp; Leaders</p>
              </div>
              <button
                onClick={() => setMemberModal({ highlighted: false, titleClass: 'badge-violet' })}
                className="px-4 py-2.5 rounded-xl bg-[#7c3aed] text-white text-xs font-bold shadow-md hover:bg-[#8b5cf6] cursor-pointer"
              >
                + Add Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(store?.studentTeam || []).map((m: TeamMemberItem) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-white/10 bg-[#0c091f]/80 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-[#38bdf8] uppercase tracking-wider">{m.role}</span>
                      <span className={`badge ${m.titleClass}`}>{m.title}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{m.name}</h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">{m.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-[11px] text-[#94a3b8]">
                      {m.imageUrl ? '📷 Custom Image Attached' : '🖼️ Default Preset Image'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMemberModal(m)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-xs font-semibold text-red-300 hover:bg-red-500/30 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EVENTS & WORKSHOPS MANAGEMENT */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight mb-1">Events &amp; Workshops</h1>
                <p className="text-xs text-[#94a3b8]">Manage Workshops, Contests &amp; Image Gallery Slideshows</p>
              </div>
              <button
                onClick={() => setEventModal({ badgeClass: 'badge-violet', galleryImages: [] })}
                className="px-4 py-2.5 rounded-xl bg-[#38bdf8] text-[#06050c] text-xs font-bold shadow-md hover:bg-[#7dd3fc] cursor-pointer"
              >
                + Create Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(store?.events || []).map((ev: EventItem) => (
                <div key={ev.id} className="rounded-2xl border border-white/10 bg-[#0c091f]/80 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#94a3b8]">{ev.date}</span>
                      <span className={`badge ${ev.badgeClass}`}>{ev.badge}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{ev.title}</h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">{ev.description}</p>

                    {/* Gallery count indicator */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] bg-white/[0.05] border border-white/10 text-[#38bdf8] mb-3">
                      <span>🖼️</span>
                      <span>
                        {ev.galleryImages && ev.galleryImages.length > 0
                          ? `${ev.galleryImages.length} Custom Photos in Hover Slideshow`
                          : 'Default Folder Photos Used'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => setEventModal(ev)}
                      className="px-3.5 py-1.5 rounded-lg bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer"
                    >
                      Edit Event &amp; Gallery
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev)}
                      className="px-3.5 py-1.5 rounded-lg bg-red-500/20 text-xs font-semibold text-red-300 hover:bg-red-500/30 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA MANAGER */}
        {activeTab === 'media' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight mb-1">Media Storage</h1>
                <p className="text-xs text-[#94a3b8]">Upload and manage images stored in /public/uploads</p>
              </div>

              <label className="px-4 py-2.5 rounded-xl bg-[#7c3aed] text-white text-xs font-bold shadow-md hover:bg-[#8b5cf6] cursor-pointer inline-flex items-center gap-2">
                <span>📤 Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const url = await handleFileUpload(e.target.files[0]);
                      if (url) showToast('Image uploaded successfully!');
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((m) => (
                <div key={m.fileName} className="rounded-xl border border-white/10 bg-[#0c091f]/80 p-3 flex flex-col items-center">
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-black/50 mb-2.5 border border-white/5">
                    <img src={m.url} alt={m.fileName} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[11px] text-[#94a3b8] font-mono truncate w-full mb-2 text-center" title={m.fileName}>
                    {m.fileName}
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => { navigator.clipboard.writeText(m.url); showToast('URL copied to clipboard!'); }}
                      className="flex-1 py-1 rounded bg-white/10 text-[10px] font-semibold text-white hover:bg-white/20 cursor-pointer"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(m.fileName)}
                      className="py-1 px-2 rounded bg-red-500/20 text-[10px] font-semibold text-red-300 hover:bg-red-500/30 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          MODALS & FORM DRAWERS
          ========================================== */}

      {/* Member Form Modal */}
      {memberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d0b1a] border border-purple-500/40 p-6 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{memberModal.id ? 'Edit Student Member' : 'Add New Student Member'}</h3>
            <form onSubmit={handleSaveMember} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={memberModal.name || ''}
                  onChange={(e) => setMemberModal({ ...memberModal, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Role Category Header (e.g. EXECUTIVE LEADERSHIP)</label>
                <input
                  type="text"
                  required
                  value={memberModal.role || ''}
                  onChange={(e) => setMemberModal({ ...memberModal, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none focus:border-purple-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Title (e.g. President)</label>
                  <input
                    type="text"
                    required
                    value={memberModal.title || ''}
                    onChange={(e) => setMemberModal({ ...memberModal, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Badge Class</label>
                  <select
                    value={memberModal.titleClass || 'badge-violet'}
                    onChange={(e) => setMemberModal({ ...memberModal, titleClass: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#100b20] border border-white/10 text-white outline-none"
                  >
                    <option value="badge-violet">badge-violet</option>
                    <option value="badge-cyan">badge-cyan</option>
                    <option value="badge-orange">badge-orange</option>
                    <option value="badge-green">badge-green</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  required
                  value={memberModal.description || ''}
                  onChange={(e) => setMemberModal({ ...memberModal, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Portrait Image URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={memberModal.imageUrl || ''}
                    onChange={(e) => setMemberModal({ ...memberModal, imageUrl: e.target.value })}
                    placeholder="/uploads/my_photo.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await handleFileUpload(e.target.files[0]);
                          if (url) setMemberModal({ ...memberModal, imageUrl: url });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setMemberModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7c3aed] text-xs font-bold text-white hover:bg-[#8b5cf6] cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {eventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-[#0d0b1a] border border-cyan-500/40 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{eventModal.id ? 'Edit Event' : 'Create New Event'}</h3>
            <form onSubmit={handleSaveEvent} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventModal.title || ''}
                    onChange={(e) => setEventModal({ ...eventModal, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Date String</label>
                  <input
                    type="text"
                    required
                    placeholder="March 25, 2026"
                    value={eventModal.date || ''}
                    onChange={(e) => setEventModal({ ...eventModal, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Badge Text</label>
                  <input
                    type="text"
                    required
                    placeholder="FLAGSHIP MASTERCLASS"
                    value={eventModal.badge || ''}
                    onChange={(e) => setEventModal({ ...eventModal, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Badge Color Style</label>
                  <select
                    value={eventModal.badgeClass || 'badge-violet'}
                    onChange={(e) => setEventModal({ ...eventModal, badgeClass: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#100b20] border border-white/10 text-white outline-none"
                  >
                    <option value="badge-violet">badge-violet</option>
                    <option value="badge-orange">badge-orange</option>
                    <option value="badge-cyan">badge-cyan</option>
                    <option value="badge-green">badge-green</option>
                    <option value="badge-red">badge-red</option>
                    <option value="badge-blue">badge-blue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  required
                  value={eventModal.description || ''}
                  onChange={(e) => setEventModal({ ...eventModal, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                />
              </div>

              {/* Gallery Photos Upload Manager */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs text-[#38bdf8] font-bold">Hover Slideshow Photo Gallery</label>
                  <label className="px-3 py-1 rounded-lg bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] text-xs font-bold hover:bg-[#38bdf8]/30 cursor-pointer">
                    + Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files) {
                          const uploadedUrls: string[] = [];
                          for (let i = 0; i < e.target.files.length; i++) {
                            const url = await handleFileUpload(e.target.files[i]);
                            if (url) uploadedUrls.push(url);
                          }
                          const currentGallery = eventModal.galleryImages || [];
                          setEventModal({ ...eventModal, galleryImages: [...currentGallery, ...uploadedUrls] });
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto p-2 bg-black/40 rounded-xl">
                  {(eventModal.galleryImages || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden h-20 bg-black/60 border border-white/10">
                      <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (eventModal.galleryImages || []).filter((_, i) => i !== idx);
                          setEventModal({ ...eventModal, galleryImages: updated });
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(!eventModal.galleryImages || eventModal.galleryImages.length === 0) && (
                    <div className="col-span-4 text-center py-4 text-xs text-[#94a3b8]">
                      No custom photos uploaded. Will use pre-existing static photos if available.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEventModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#38bdf8] text-xs font-bold text-[#06050c] hover:bg-[#7dd3fc] cursor-pointer"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Form Modal */}
      {facultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0d0b1a] border border-purple-500/40 p-6 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{facultyModal.id ? 'Edit Faculty Member' : 'Add Faculty Member'}</h3>
            <form onSubmit={handleSaveFaculty} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  required
                  value={facultyModal.name || ''}
                  onChange={(e) => setFacultyModal({ ...facultyModal, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Initials</label>
                <input
                  type="text"
                  required
                  value={facultyModal.initials || ''}
                  onChange={(e) => setFacultyModal({ ...facultyModal, initials: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Role</label>
                <input
                  type="text"
                  required
                  value={facultyModal.role || ''}
                  onChange={(e) => setFacultyModal({ ...facultyModal, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1 font-semibold">Portrait Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={facultyModal.imageUrl || ''}
                    onChange={(e) => setFacultyModal({ ...facultyModal, imageUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white outline-none"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await handleFileUpload(e.target.files[0]);
                          if (url) setFacultyModal({ ...facultyModal, imageUrl: url });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setFacultyModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7c3aed] text-xs font-bold text-white hover:bg-[#8b5cf6] cursor-pointer"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-[#140b18] border border-red-500/40 p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-red-400 mb-2">{confirmDelete.title}</h3>
            <p className="text-xs text-[#94a3b8] mb-6 leading-relaxed">{confirmDelete.message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete.onConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-500 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
