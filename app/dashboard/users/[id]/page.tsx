"use client";
import { useParams } from "next/navigation";
import UserDetailsCard from "../components/UserDetailsCard";
import UserPets from "../components/UserPets";
import UserPosts from "../components/UserPosts";
import UserAdminActions from "../components/UserAdminActions";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { FileText, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../../../../axios";
import { ErrorToast, SuccessToast } from "@/components/Toaster";
import { AxiosError } from "axios";

const proofDocuments = [
  {
    id: 1,
    name: "Payment_Receipt.pdf",
    url: "https://s3.amazonaws.com/bucket/file.pdf",
    type: "pdf",
  },
  {
    id: 2,
    name: "Service_Image.png",
    url: "https://cdn.example.com/docs/image.png",
    type: "image",
  },
  {
    id: 3,
    name: "Completion_Photo.jpg",
    url: "https://cdn.example.com/docs/image.png",
    type: "image",
  },
];

export default function UserDetailPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/admin/users/${id}`);
        if (response.status === 200) {
          setUserData(response.data.data);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        ErrorToast(
          err.response?.data?.message ?? "Failed to fetch user details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id, update]);

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await axios.delete(`/admin/users/content/${postId}`);
      if (response.status === 200) {
        SuccessToast("Post removed successfully");
        setUpdate((prev) => !prev);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      ErrorToast(err.response?.data?.message ?? "Failed to remove post");
    }
  };

  // Transform API data to match component expectations
  const transformedUser = userData
    ? {
        ...userData,
        name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        status: userData.accountStatus,
        rank: userData.role,
        badges: [], // Add badges logic if needed
      }
    : null;

  // function FileIcon({ type }: { type: string }) {
  //   if (type === "pdf") {
  //     return <FileText className="w-5 h-5 text-red-500" />;
  //   }

  //   return <ImageIcon className="w-5 h-5 text-blue-500" />;
  // }

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ) : userData?.role === "SERVICE_PROVIDER" ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Vendor Details</h1>
          {/* <div className="p-4 rounded-md border mb-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-semibold">${3000}</p>
          </div>
          <div className="p-4 rounded-md border mt-2 space-y-3">
            <p className="text-xl font-semibold">Proof Documents</p>

            {proofDocuments.length ? (
              <div className="space-y-2">
                {proofDocuments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer" // ✅ security
                    className="flex items-center justify-between rounded-md border p-3 hover:bg-muted transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileIcon type={doc.type} />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {doc.type}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm text-primary">View</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No proof documents uploaded.
              </p>
            )}
          </div> */}

          {userData?.BusinessProfile?.length > 0 ? (
            <div className="p-4 rounded-md border mt-2 space-y-3">
              <p className="text-xl font-semibold">Business Profile</p>

              {userData.BusinessProfile.map((business) => (
                <div key={business.id} className="space-y-4">
                  {business.imageUrl && (
                    <div className="h-48 overflow-hidden rounded">
                      <img
                        src={business.imageUrl}
                        alt={business.businessName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Business Name
                      </div>
                      <div className="font-medium">{business.businessName}</div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Business Email
                      </div>
                      <div className="font-medium">
                        {business.businessEmail}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Business Phone
                      </div>
                      <div className="font-medium">
                        {business.businessPhoneNumber}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Experience Years
                      </div>
                      <div className="font-medium">
                        {business.experienceYears}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">
                        Location
                      </div>
                      <div className="font-medium">{business.location}</div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">
                        Description
                      </div>
                      <div className="font-medium">{business.description}</div>
                    </div>
                  </div>

                  {/* Certifications */}
                  {business.Certification?.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold mb-2">
                        Certifications
                      </div>

                      <div className="space-y-2">
                        {business.Certification.map((cert) => (
                          <div
                            key={cert.id}
                            className="p-3 border rounded space-y-1"
                          >
                            <div className="font-medium">
                              {cert.certificationName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Institution: {cert.institution}
                            </div>
                            <div className="text-sm">
                              Date of Completion:{" "}
                              {new Date(
                                cert.dateOfCompletion,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-sm">{cert.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-md border mt-6 space-y-3">
              No Detail Provided
            </div>
          )}
        </>
      ) : userData?.role === "EVENT_ORGANIZER" ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Event Organizer Details</h1>
          {/* <div className="p-4 rounded-md border mb-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-semibold">${3000}</p>
          </div>
          <div className="p-4 rounded-md border mt-2 space-y-3">
            <p className="text-xl font-semibold">Proof Documents</p>

            {proofDocuments.length ? (
              <div className="space-y-2">
                {proofDocuments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer" // ✅ security
                    className="flex items-center justify-between rounded-md border p-3 hover:bg-muted transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileIcon type={doc.type} />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {doc.type}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm text-primary">View</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No proof documents uploaded.
              </p>
            )}
          </div> */}

          {userData?.BusinessProfile?.length > 0 ? (
            <div className="p-4 rounded-md border mt-2 space-y-3">
              <p className="text-xl font-semibold">Business Profile</p>

              {userData.BusinessProfile.map((business) => (
                <div key={business.id} className="space-y-4">
                  {business.imageUrl && (
                    <div className="h-48 overflow-hidden rounded">
                      <img
                        src={business.imageUrl}
                        alt={business.businessName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Business Name
                      </div>
                      <div className="font-medium">{business.businessName}</div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Business Email
                      </div>
                      <div className="font-medium">
                        {business.businessEmail}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Business Phone
                      </div>
                      <div className="font-medium">
                        {business.businessPhoneNumber}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Experience Years
                      </div>
                      <div className="font-medium">
                        {business.experienceYears}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">
                        Location
                      </div>
                      <div className="font-medium">{business.location}</div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">
                        Description
                      </div>
                      <div className="font-medium">{business.description}</div>
                    </div>
                  </div>

                  {/* Certifications */}
                  {business.Certification?.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold mb-2">
                        Certifications
                      </div>

                      <div className="space-y-2">
                        {business.Certification.map((cert) => (
                          <div
                            key={cert.id}
                            className="p-3 border rounded space-y-1"
                          >
                            <div className="font-medium">
                              {cert.certificationName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Institution: {cert.institution}
                            </div>
                            <div className="text-sm">
                              Date of Completion:{" "}
                              {new Date(
                                cert.dateOfCompletion,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-sm">{cert.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-md border mt-6 space-y-3">
              No Detail Provided
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">User Details</h1>
          {/* Account Details */}
          <div className="w-full flex gap-3">
            <UserDetailsCard user={transformedUser} />
            <Card className=" w-[50%]">
              <CardContent>
                <div className=" w-full">
                  <h2 className="text-lg font-semibold mb-2">
                    Total No of Posts
                  </h2>
                </div>
                <p className="text-3xl font-semibold">
                  {userData?.posts?.length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Linked Pets */}
          <UserPets pets={userData?.petProfiles || []} />

          {/* Posts & Engagement */}
          <UserPosts
            posts={userData?.posts || []}
            onDeletePost={handleDeletePost}
          />

          {/* Admin Actions */}
          <UserAdminActions
            user={transformedUser}
            reports={userData?.reports || []}
          />
        </>
      )}
    </div>
  );
}
