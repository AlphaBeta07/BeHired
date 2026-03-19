import * as zod from "zod";

export const HealthCheckResponse = zod.object({ status: zod.string() });

export const RegisterUserBody = zod.object({
  email: zod.string(),
  password: zod.string(),
  name: zod.string(),
  role: zod.enum(["jobseeker", "employer"]),
});

export const LoginUserBody = zod.object({
  email: zod.string(),
  password: zod.string(),
});

export const UpdateMyProfileBody = zod.object({
  name: zod.string().nullish(),
  bio: zod.string().nullish(),
  skills: zod.array(zod.string()).nullish(),
  location: zod.string().nullish(),
  avatar: zod.string().nullish(),
  resumeUrl: zod.string().nullish(),
  companyName: zod.string().nullish(),
  companyDescription: zod.string().nullish(),
  companyWebsite: zod.string().nullish(),
  companyLogo: zod.string().nullish(),
});

export const CreateJobBody = zod.object({
  title: zod.string(),
  company: zod.string(),
  companyLogo: zod.string().nullish(),
  location: zod.string(),
  type: zod.enum(["job", "internship"]),
  salary: zod.string().nullish(),
  description: zod.string(),
  requirements: zod.array(zod.string()).nullish(),
  tags: zod.array(zod.string()).nullish(),
  remote: zod.boolean().nullish(),
});

export const CreateSwipeBody = zod.object({
  jobId: zod.string(),
  direction: zod.enum(["like", "pass"]),
});

export const EmployerSwipeBody = zod.object({
  applicantId: zod.string(),
  jobId: zod.string(),
  direction: zod.enum(["like", "pass"]),
});
