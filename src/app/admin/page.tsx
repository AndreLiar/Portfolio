import Link from 'next/link';
import { 
  Users, 
  FileText, 
  FolderOpen, 
  Settings, 
  TrendingUp,
  BookOpen,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Heart,
  User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const adminSections = [
  {
    title: 'Blog Posts',
    description: 'Manage your blog content and articles',
    href: '/admin/blog',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Projects',
    description: 'Showcase your portfolio projects',
    href: '/admin/projects',
    icon: FolderOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Skills',
    description: 'Manage your technical skills',
    href: '/admin/skills',
    icon: Settings,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Journey',
    description: 'Track your professional journey',
    href: '/admin/journey',
    icon: MapPin,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Work Experience',
    description: 'Document your career history',
    href: '/admin/work-experience',
    icon: Briefcase,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'Education',
    description: 'Manage your educational background',
    href: '/admin/education',
    icon: GraduationCap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Languages',
    description: 'Add languages you speak',
    href: '/admin/languages',
    icon: Languages,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'Interests',
    description: 'Share your personal interests',
    href: '/admin/interests',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    title: 'About/Bio',
    description: 'Update your personal information',
    href: '/admin/bio',
    icon: User,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
];

export default function AdminDashboard() {
  return (
    <div className="h-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your portfolio content, blog posts, and personal information from one central location.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Sections</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{adminSections.length}</div>
              <p className="text-xs text-blue-700 mt-1">
                Portfolio sections to manage
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Content Types</CardTitle>
              <BookOpen className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">9</div>
              <p className="text-xs text-green-700 mt-1">
                Different content categories
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Management</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">CMS</div>
              <p className="text-xs text-purple-700 mt-1">
                Content Management System
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card 
                key={section.href} 
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200 shadow-md hover:border-primary/30 overflow-hidden"
              >
                <CardHeader className="pb-4 bg-gradient-to-br from-gray-50/50 to-white">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${section.bgColor} shadow-sm`}>
                      <IconComponent className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-700">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 bg-white">
                  <Link href={section.href}>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Manage {section.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200/50">
            <CardTitle className="text-2xl font-bold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">
              Common tasks to get you started quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/blog/new">
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-6 flex flex-col gap-3 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 group"
                >
                  <FileText className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">New Blog Post</span>
                </Button>
              </Link>
              <Link href="/admin/projects/new">
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-6 flex flex-col gap-3 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300 group"
                >
                  <FolderOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Add Project</span>
                </Button>
              </Link>
              <Link href="/admin/skills/new">
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-6 flex flex-col gap-3 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-300 group"
                >
                  <Settings className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Add Skill</span>
                </Button>
              </Link>
              <Link href="/admin/bio">
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-6 flex flex-col gap-3 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-all duration-300 group"
                >
                  <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Update Bio</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}