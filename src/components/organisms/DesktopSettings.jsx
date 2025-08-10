import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Palette,
  Lock,
  Eye,
  EyeOff,
  Globe,
  MessageCircle,
  Heart,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Save,
  RotateCcw,
} from "lucide-react";
import Button from "../atoms/Button";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, toggleSafeMode } from "../../store/themeSlice";

const DesktopSettings = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const [activeSection, setActiveSection] = useState("account");
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: false,
      sounds: true,
      likes: true,
      comments: true,
      follows: true,
      messages: true,
    },
    privacy: {
      profileVisibility: "public",
      showOnlineStatus: true,
      allowMessages: "everyone",
      showReadReceipts: true,
    },
    display: {
      theme: theme,
      fontSize: "medium",
      reducedMotion: false,
      highContrast: false,
    },
  });

  const sections = [
    { id: "account", label: "Account", icon: User },
    { id: "privacy", label: "Privacy & Safety", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "display", label: "Display & Accessibility", icon: Monitor },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleThemeChange = (newTheme) => {
    handleSettingChange("display", "theme", newTheme);
    dispatch(toggleTheme());
  };

  const renderAccountSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Account Information
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={user?.name || "Anonymous Soul"}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user?.email || "emo@gmail.com"}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            rows={3}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Security
        </h4>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Two-Factor Authentication
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Privacy & Safety
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Shield
              className={`w-5 h-5 ${
                user?.safeMode ? "text-green-500" : "text-red-500"
              }`}
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Safe Mode
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Filter sensitive content and enable additional protections
              </div>
            </div>
          </div>
          <Button
            variant={user?.safeMode ? "default" : "outline"}
            onClick={() => dispatch(toggleSafeMode())}
            className={user?.safeMode ? "bg-green-600 hover:bg-green-700" : ""}>
            {user?.safeMode ? "ON" : "OFF"}
          </Button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Profile Visibility
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Who can see your profile
              </div>
            </div>
          </div>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) =>
              handleSettingChange(
                "privacy",
                "profileVisibility",
                e.target.value
              )
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="public">Public</option>
            <option value="followers">Followers Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 text-purple-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Allow Messages From
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Who can send you direct messages
              </div>
            </div>
          </div>
          <select
            value={settings.privacy.allowMessages}
            onChange={(e) =>
              handleSettingChange("privacy", "allowMessages", e.target.value)
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="everyone">Everyone</option>
            <option value="followers">Followers Only</option>
            <option value="none">No One</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Show Online Status
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Let others know when you're active
              </div>
            </div>
          </div>
          <Button
            variant={settings.privacy.showOnlineStatus ? "default" : "outline"}
            onClick={() =>
              handleSettingChange(
                "privacy",
                "showOnlineStatus",
                !settings.privacy.showOnlineStatus
              )
            }
            size="sm">
            {settings.privacy.showOnlineStatus ? "ON" : "OFF"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Notification Preferences
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Push Notifications
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications on your device
              </div>
            </div>
          </div>
          <Button
            variant={settings.notifications.push ? "default" : "outline"}
            onClick={() =>
              handleSettingChange(
                "notifications",
                "push",
                !settings.notifications.push
              )
            }
            size="sm">
            {settings.notifications.push ? "ON" : "OFF"}
          </Button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {settings.notifications.sounds ? (
              <Volume2 className="w-5 h-5 text-yellow-500" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Notification Sounds
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Play sounds for notifications
              </div>
            </div>
          </div>
          <Button
            variant={settings.notifications.sounds ? "default" : "outline"}
            onClick={() =>
              handleSettingChange(
                "notifications",
                "sounds",
                !settings.notifications.sounds
              )
            }
            size="sm">
            {settings.notifications.sounds ? "ON" : "OFF"}
          </Button>
        </div>

        <div className="pl-8 space-y-3 border-l-2 border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Notify me when someone:
          </h4>

          {[
            { key: "likes", label: "Likes my posts", icon: Heart },
            {
              key: "comments",
              label: "Comments on my posts",
              icon: MessageCircle,
            },
            { key: "follows", label: "Follows me", icon: User },
            {
              key: "messages",
              label: "Sends me a message",
              icon: MessageCircle,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <item.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
              </div>
              <Button
                variant={
                  settings.notifications[item.key] ? "default" : "outline"
                }
                onClick={() =>
                  handleSettingChange(
                    "notifications",
                    item.key,
                    !settings.notifications[item.key]
                  )
                }
                size="xs">
                {settings.notifications[item.key] ? "ON" : "OFF"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDisplaySection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Display & Accessibility
      </h3>

      <div className="space-y-4">
        <div className="py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <Palette className="w-5 h-5 text-purple-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Theme
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred color scheme
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              size="sm"
              className="flex items-center space-x-2">
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              size="sm"
              className="flex items-center space-x-2">
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === "auto" ? "default" : "outline"}
              onClick={() => handleThemeChange("auto")}
              size="sm"
              className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>Auto</span>
            </Button>
          </div>
        </div>

        <div className="py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <span className="w-5 h-5 text-lg">Aa</span>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Font Size
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Adjust text size for better readability
              </div>
            </div>
          </div>
          <select
            value={settings.display.fontSize}
            onChange={(e) =>
              handleSettingChange("display", "fontSize", e.target.value)
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <RotateCcw className="w-5 h-5 text-orange-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Reduced Motion
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Minimize animations and transitions
              </div>
            </div>
          </div>
          <Button
            variant={settings.display.reducedMotion ? "default" : "outline"}
            onClick={() =>
              handleSettingChange(
                "display",
                "reducedMotion",
                !settings.display.reducedMotion
              )
            }
            size="sm">
            {settings.display.reducedMotion ? "ON" : "OFF"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Advanced Settings
      </h3>

      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
              Data & Privacy
            </h4>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            Manage your data, export your information, or delete your account.
          </p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start">
              Download My Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20">
              Delete Account
            </Button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-800 dark:text-blue-200">
              Developer Options
            </h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Advanced options for developers and power users.
          </p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start">
              API Access
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start">
              Debug Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "account":
        return renderAccountSection();
      case "privacy":
        return renderPrivacySection();
      case "notifications":
        return renderNotificationsSection();
      case "display":
        return renderDisplaySection();
      case "advanced":
        return renderAdvancedSection();
      default:
        return renderAccountSection();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Settings
                </h2>
              </div>
            </div>

            <nav className="p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600/50"
                  }`}>
                  <section.icon className="w-5 h-5" />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}>
              {renderSectionContent()}
            </motion.div>

            {/* Save Changes Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
              <Button variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSettings;
