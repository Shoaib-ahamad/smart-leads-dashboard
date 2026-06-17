import { Request, Response } from "express";

import Lead from "../models/lead.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const createLead = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
) => {
  try {
    // Query params
    const {
      status,
      source,
      search,
      page = "1",
      limit = "10",
      sort = "desc",
    } = req.query;

    // Filters
    const filters: any = {};

    if (status) {
      filters.status = status;
    }

    if (source) {
      filters.source = source;
    }

    // Search
    if (search) {
      filters.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip =
      (pageNumber - 1) * limitNumber;

    // Sorting
   const sortOption =
  sort === "asc"
    ? { createdAt: "asc" as const }
    : { createdAt: "desc" as const };

    // Total count
    const totalLeads =
      await Lead.countDocuments(filters);

    // Leads
    const leads = await Lead.find(filters)
      .populate(
        "createdBy",
        "name email role"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      total: totalLeads,
      currentPage: pageNumber,
      totalPages: Math.ceil(
        totalLeads / limitNumber
      ),
      leads,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};
export const getLeadById = async (
  req: Request,
  res: Response
) => {
  try {
    const lead = await Lead.findById(
      req.params.id
    ).populate(
      "createdBy",
      "name email role"
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response
) => {
  try {
    const lead = await Lead.findByIdAndDelete(
      req.params.id
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getLeadsStats = async (
  req: Request,
  res: Response
) => {
  try {
    const { status, source, search } = req.query;

    const filters: any = {};

    if (status) {
      filters.status = status;
    }

    if (source) {
      filters.source = source;
    }

    if (search) {
      filters.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Get counts grouped by status
    const statusCounts = await Lead.aggregate([
      { $match: filters },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get counts grouped by source
    const sourceCounts = await Lead.aggregate([
      { $match: filters },
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format status stats
    const statusMap: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0,
    };

    statusCounts.forEach((item) => {
      if (item._id in statusMap) {
        statusMap[item._id] = item.count;
      }
    });

    // Format source stats
    const sourceMap: Record<string, number> = {
      Website: 0,
      Instagram: 0,
      Referral: 0,
    };

    sourceCounts.forEach((item) => {
      if (item._id in sourceMap) {
        sourceMap[item._id] = item.count;
      }
    });

    // Total filtered leads
    const totalLeads = await Lead.countDocuments(filters);

    res.status(200).json({
      success: true,
      stats: {
        total: totalLeads,
        status: statusMap,
        source: sourceMap,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};