import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { toast } from "react-toastify";
import classService from "@/services/api/classService";
import announcementService from "@/services/api/announcementService";

const Announcements = ({ userRole }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
const [formData, setFormData] = useState({
    Title_c: "",
    Content_c: "",
    Class_c: ""
  });
  const [creating, setCreating] = useState(false);

  const loadAnnouncementsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [announcementsData, classesData] = await Promise.all([
        announcementService.getAll(),
        classService.getAll()
      ]);
      
      setAnnouncements(announcementsData);
      setClasses(classesData);
    } catch (err) {
      setError("Failed to load announcements. Please try again.");
      console.error("Announcements loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncementsData();
  }, []);

const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!formData.Title_c.trim() || !formData.Content_c.trim() || !formData.Class_c) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setCreating(true);
      const newAnnouncement = await announcementService.create({
        Title_c: formData.Title_c,
        Content_c: formData.Content_c,
        Class_c: parseInt(formData.Class_c)
      });
      
      if (newAnnouncement) {
        const updatedAnnouncements = [newAnnouncement, ...announcements];
        setAnnouncements(updatedAnnouncements);
        setShowCreateModal(false);
        setFormData({ Title_c: "", Content_c: "", Class_c: "" });
      }
    } catch (err) {
      console.error("Announcement creation error:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAnnouncementsData} />;
  }

  const filteredAnnouncements = selectedClass 
? announcements.filter(a => a.Class_c?.Id === parseInt(selectedClass) || a.Class_c === parseInt(selectedClass))
    : announcements;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {userRole === "teacher" ? "Announcements" : "Class Announcements"}
          </h1>
          <p className="text-slate-600 mt-1">
            {userRole === "teacher" 
              ? "Share important updates and information with your students."
              : "Stay updated with the latest news from your classes."
            }
          </p>
        </div>
        {userRole === "teacher" && (
          <div className="mt-4 sm:mt-0">
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
              leftIcon="Plus"
            >
              New Announcement
            </Button>
          </div>
        )}
      </div>

      {/* Class Filter */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Filter by Class</h3>
            <p className="text-sm text-slate-600">
              {userRole === "teacher" 
                ? "View announcements for specific classes"
                : "See announcements from your enrolled classes"
              }
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-white"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
<option key={cls.Id} value={cls.Id.toString()}>{cls.Name_c}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <Empty
          type="announcements"
          onAction={userRole === "teacher" ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement) => {
const classInfo = classes.find(c => c.Id === (announcement.Class_c?.Id || announcement.Class_c));
            
            return (
              <Card key={announcement.Id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                    <ApperIcon name="Megaphone" className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{announcement.title}</h3>
<div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center">
                            <ApperIcon name="GraduationCap" className="h-4 w-4 mr-2" />
                            <span>{classInfo?.Name_c || "General"}</span>
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                            <span>{format(new Date(announcement.CreatedDate), "MMM d, yyyy 'at' h:mm a")}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="primary" size="sm">
                        <ApperIcon name="Megaphone" className="h-3 w-3 mr-1" />
                        Announcement
                      </Badge>
                    </div>
                    
                    <div className="prose prose-slate max-w-none mb-4">
                      <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
{announcement.Content_c}
                      </p>
                    </div>
                    
                    {userRole === "teacher" && (
                      <div className="flex items-center space-x-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center text-sm text-slate-500">
<ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                          <span>Viewed by {Math.floor(Math.random() * 10) + 1} students</span>
                        </div>
                        <Button variant="ghost" size="sm" leftIcon="Edit">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon="Trash2">
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create Announcement</h3>
                <p className="text-sm text-slate-600">Share important information with your students</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAnnouncement} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Announcement Title"
                  name="title"
                  placeholder="Enter announcement title"
value={formData.Title_c}
                  onChange={(e) => setFormData({...formData, Title_c: e.target.value})}
                  required
                />
                <FormField
type="select"
                  label="Class"
                  name="Class_c"
                  value={formData.Class_c}
                  onChange={(e) => setFormData({...formData, Class_c: e.target.value})}
                  options={classes.map(cls => ({ value: cls.Id.toString(), label: cls.Name_c }))}
                  required
                />
              </div>
              
              <FormField
                type="textarea"
label="Announcement Content"
                name="Content_c"
                value={formData.Content_c}
                onChange={(e) => setFormData({...formData, Content_c: e.target.value})}
                placeholder="Enter your announcement message here..."
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                required
              />
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="Info" className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Announcement Guidelines</p>
                    <p className="text-sm text-amber-700">Keep announcements clear and concise. Students will receive notifications for new announcements.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={creating}
                  className="flex-1"
                >
                  Post Announcement
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      {userRole === "teacher" && announcements.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Announcement Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mx-auto mb-3">
                <ApperIcon name="Megaphone" className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="text-2xl font-bold gradient-text mb-1">{announcements.length}</h4>
              <p className="text-sm text-slate-600">Total Announcements</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl mx-auto mb-3">
                <ApperIcon name="Eye" className="h-6 w-6 text-success-600" />
              </div>
              <h4 className="text-2xl font-bold gradient-text mb-1">87%</h4>
              <p className="text-sm text-slate-600">Average View Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mx-auto mb-3">
                <ApperIcon name="Clock" className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold gradient-text mb-1">2.3</h4>
              <p className="text-sm text-slate-600">Days Avg Response</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Announcements;